import { Router, Request, Response } from "express";
import db from "../db/index";
import { compare } from "bcryptjs";
import { addCookieMiddleWare, verifyToken } from "../middleware/index";
import { customRequest } from "../types/index";
const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({
    message: "api working correctly",
  });
});

//@ts-ignores
userRouter.get(
  "/user-details",
  //@ts-ignores
  verifyToken,
  async (req: customRequest, res) => {
    const id = req.userId;
    try {
      const userDetails = await db.user.findUnique({
        where: {
          id: id,
        },
        include: {
          addresses: true,
        },
      });
      console.log("user details ", userDetails);

      if (userDetails) {
        return res.status(201).json({
          success: true,
          message: "User details fecthed successfully",
          userDetails,
        });
      } else {
        return res.status(201).json({
          success: false,
          message: "User doesnot exist ",
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
userRouter.post("/login", addCookieMiddleWare, async (req, res) => {
  res.status(200).json({
    success: true,
    messaeg: "user logged in successfullu",
  });
});

export default userRouter;
