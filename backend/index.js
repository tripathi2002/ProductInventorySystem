const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDb = require("./db/connect");
const { errorHandler } = require("./middlewares/error.middleware");
const port = process.env.PORT || 3000;

const app = express();

connectDb();

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 100000,
  })
);
app.use("/images/uploads", express.static("images/uploads"));

app.use((req, res, next) => {
  const contentLength = req.headers["content-length"];
  if (contentLength) {
    // const contentLengthInMB = (
    //   parseInt(contentLength, 10) /
    //   (1024 * 1024)
    // ).toFixed(2); // Convert bytes to MB
    // console.log(`Content-Length: ${contentLengthInMB} MB`);
  } else {
    // console.log("Content-Length header is missing");
  }
  next();
});

app.use("/api/products", require("./routes/product.route"));
app.use("/api/categories", require("./routes/category.routes"));

app.get("/", (req, res) => {
  res.send("welcome to psi api");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
