import { Router, Request, Response } from "express";
import db from "../db/index";
import { verifyToken } from "../middleware";
import { customRequest } from "../types";
const orderRouter = Router();
orderRouter.get("/", (req, res) => {
  res.json({
    message: "api working correctly",
  });
});
//@ts-ignore
orderRouter.get(
  "/all-order-details",
  //@ts-ignore
  verifyToken,
  async (req: customRequest, res) => {
    const userId = req.userId;
    try {
      if (!userId) {
        return res.status(201).json({
          success: false,
          message: "userID doesnot exist...login to see order details ",
        });
      }
      const orderDetails = await db.order.findMany({
        where: {
          userId: userId,
        },
        include: {
          orderItems: true,
        },
      });
      if (orderDetails) {
        return res.status(201).json({
          success: true,
          message: "all Order details fecthed successfully",
          orderDetails,
        });
      } else {
        return res.status(201).json({
          success: false,
          message: "Orders doesnot exist ",
        });
      }
    } catch (error) {
      console.log("error ", error);

      return res.status(501).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);
//@ts-ignore
orderRouter.post("/order-details", async (req, res) => {
  const { orderId } = req.body;
  try {
    if (!orderId) {
      return res.status(201).json({
        success: false,
        message: "OrderId doesnot exist ",
      });
    }
    const orderDetails = await db.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (orderDetails) {
      return res.status(201).json({
        success: true,
        message: " Order details fetched successfully",
        orderDetails,
      });
    } else {
      return res.status(201).json({
        success: false,
        message: "Order doesnot exist ",
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

export default orderRouter;
