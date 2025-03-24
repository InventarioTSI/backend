import { authService } from "../services/auth.service.js";
import { body, validationResult } from "express-validator";
import { createAccessToken } from "../lib/jwt.js";

const register = async (req, res) => {
  try {
    await body("userName").notEmpty().run(req);
    await body("password").notEmpty().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: "FAILED", data: "user and password are required" });
    }

    const newUser = {
      userName: req.body.userName,
      password: req.body.password,
    };

    const registeredUser = await authService.register(newUser);

    const token = await createAccessToken({ id: registeredUser.id });

    return res
      .status(201)
      .send({ status: "OK", data: registeredUser, token: token });
  } catch (error) {
    return res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const login = async (req, res) => {
  try {
    await body("userName").notEmpty().run(req);
    await body("password").notEmpty().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ status: "FAILED", data: "user and password are required" });
    }

    const { userName, password } = req.body;
    const user = await authService.login(userName, password);

    const token = await createAccessToken({
      id: user.userData.id,
      role: user.userData.role,
      userName: user.userData.userName,
    });

    res.status(200).send({
      status: "OK",
      data: {
        userData: {
          id: user.userData.id,
          userName: user.userData.userName,
          role: user.userData.role,
        },
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: "FAILED", data: error.message });
  }
};

const logout = async (req, res) => {
  return res
    .status(200)
    .send({ status: "OK", data: "User logged out", token: "" });
};

const verify = async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) {
      return res
        .status(401)
        .send({ status: "FAILED", data: "Unauthorized, no token" });
    }
    const user = await authService.verify(token);
    return res.status(200).send({ status: "OK", data: user });
  } catch (error) {
    return res.status(500).send({ status: "FAILED", data: error.message });
  }
};

export const AuthController = {
  register,
  login,
  logout,
  verify,
};
