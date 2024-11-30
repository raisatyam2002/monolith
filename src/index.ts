import express from "express";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import orderRouter from "./routes/orderRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({ health: "healthy" });
});
app.use("/user-api", userRouter);
app.use("/product-api", productRouter);
app.use(express.json());
app.use("/order-api", orderRouter);
app.listen(5003, () => {
  console.log("monolithic is running on http://localhost:5003");
});
