const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const taskRoutes =
  require("./routes/taskRoutes");

const authRoutes =
  require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

mongoose.connect(
  "mongodb://127.0.0.1:27017/taskdb"
)
.then(() => {

  console.log(
    "MongoDB Connected"
  );

})
.catch((err) => {

  console.log(err);

});

app.listen(3000, () => {

  console.log(
    "Server Running on 3000"
  );

});