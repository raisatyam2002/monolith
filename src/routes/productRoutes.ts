import { Router, Request, Response } from "express";
import db from "../db/index";
const productRouter = Router();
//@ts-ignore
productRouter.get("/", (req, res) => {
  res.json({
    message: "api working correctly",
  });
});
//@ts-ignore
productRouter.get("/all-product", async (req, res) => {
  try {
    const data = await db.product.findMany();
    if (data) {
      return res.status(200).json({
        success: true,
        products: data,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "error in getting all product details from db",
      });
    }
  } catch (error: any) {
    console.log("error in getting all product details from db ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//@ts-ignore
productRouter.post("/product-details", async (req, res) => {
  const { prodId } = req.body;
  try {
    const productDetails = await db.product.findUnique({
      where: {
        id: prodId,
      },
    });
    if (productDetails) {
      return res.status(201).json({
        success: true,
        message: "Product details fecthed successfully",
        productDetails,
      });
    } else {
      return res.status(201).json({
        success: false,
        message: "Product doesnot exist ",
      });
    }
  } catch (error) {
    console.log("error ", error);

    return res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default productRouter;
