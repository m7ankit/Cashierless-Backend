require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const cookieParser = require("cookie-parser");
const cors = require("cors");
var { isUnauthorized } = require("./middlewares/auth");

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripe");

//DB Connection
mongoose
  .connect(process.env.DATABASE || "mongodb://localhost:27017/cashier", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

app.locals.ONLINE_USERS = {};

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);

//Custom middleware for error handling in express-jwt
app.use(isUnauthorized);

//PORT
const port = process.env.PORT || 8000;

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("me", socket.id);

  socket.on("login", (data) => {
    console.log(data.email);
    app.locals.ONLINE_USERS[data.email] = socket.id;
  });

  socket.on("disconnect", () => {
    for (const key in app.locals.ONLINE_USERS) {
      if (app.locals.ONLINE_USERS[key] == socket.id) {
        delete app.locals.ONLINE_USERS[key];
        break;
      }
    }
    console.log("A user disconnected");
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    console.log(`From in callUser : ${from}`);
    for (const key in app.locals.ONLINE_USERS) {
      if (key == userToCall) {
        io.to(app.locals.ONLINE_USERS[key]).emit("callUser", {
          signal: signalData,
          from,
          name,
        });
        break;
      }
    }
  });

  socket.on("answerCall", (data) => {
    console.log(`answerCall ${data.to}`);
    for (const key in app.locals.ONLINE_USERS) {
      if (key == data.to) {
        io.to(app.locals.ONLINE_USERS[key]).emit("callAccepted", data.signal);
        break;
      }
    }
  });
});

//Starting a server
server.listen(port, () => {
  console.log(`app is running at ${port}`);
});
