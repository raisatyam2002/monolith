import { NextFunction, Response, Request } from "express";
import db from "../db/index";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { customRequest } from "../types";

export async function addCookieMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(201).json({
        success: false,
        message: "enter all details",
      });
    }
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log("user ", user);

    if (user && user.password) {
      const userValidation = await compare(password, user.password);
      if (userValidation) {
        console.log("jwt_secret ", process.env.jwt_secret);
        const token = jwt.sign(user.id, process.env.jwt_secret || "");
        console.log("token ", token);
        res.cookie("monolithCookie", token);
        next();
      } else {
        return res.status(201).json({
          success: false,
          message: "wrong password",
        });
      }
    }
  } catch (error) {
    console.log("error ", error);

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}

export async function verifyToken(
  req: customRequest,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("req ", req.cookies["monolithCookie"]);

    const token = req.cookies["monolithCookie"];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "user not login...login to access details",
      });
    }
    const userId = jwt.verify(token, process.env.jwt_secret || "");
    if (userId) {
      if (typeof userId === "string") {
        req.userId = userId;
        next();
      }
    } else {
      return res.status(201).json({
        success: "false",
        message: "login expired...login again",
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("error", error.message);
      return res.status(501).json({
        success: false,
        message: "server error",
        error: error.message,
      });
    } else {
      console.log("error", error);
      return res.status(501).json({
        success: false,
        message: "Unknown error occurred",
        error: "An unexpected error occurred",
      });
    }
  }
}
