// import the required modules and components
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConn from "./config/db.js";
import itemsRouter from "./routes/items-routes.js";
import ordersRouter from "./routes/orders-routes.js";
import HttpError from "./models/http-error.js";
import cors from "cors";

// configs
dotenv.config();
dbConn();

// create an Express instance
const app = express();

// add middlewares
app.use(bodyParser.json()); // support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: false })); //support parsing of application/x-www-form-urlencoded post data
app.use(morgan("dev")); // support logging of requests to the terminal
app.use(
  cors({
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// define API routes
// mainpage routes
const renderHomePage = (request, response) => {
  response.send("<h1>Welcome to Booknest</h1>");
};
app.get("/", renderHomePage);
app.get("/home", renderHomePage);

// book item routes
app.use("/items", itemsRouter);

// order routes
app.use("/orders", ordersRouter);

// handle error from unfound routes
app.use((request, response, next) => {
  const error = new HttpError("Could not find this route.", 404);
  next(error);
});

// handle error from requests
app.use((error, request, response, next) => {
  if (response.headerSent) {
    return next(error);
  }
  response.status(error.code || 500);
  response.json({ message: error.message || "An unknown error occurred!" });
});

// listen on port 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
