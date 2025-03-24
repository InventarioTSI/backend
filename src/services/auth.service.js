import { User } from "../database/user.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

const register = async (userData) => {
  const passwordHash = await bcrypt.hash(userData.password, 10);

  const userExists = await User.getUser(userData.userName);

  if (userExists) throw { status: 400, message: "User already exists" };

  const UserToInsert = {
    id: uuidv4(),
    userName: userData.userName,
    password: passwordHash,
    role: "user",
  };

  const registeredUser = await User.register(UserToInsert);
  return registeredUser;
};

const login = async (userName, password) => {
  const userFound = await User.getUser(userName);

  if (!userFound) throw { status: 401, message: "Invalid user" };

  const passwordMatch = await bcrypt.compare(
    password,
    userFound.userData.password
  );

  if (!passwordMatch) throw { status: 401, message: "Invalid password" };

  return userFound;
};

const verify = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
      if (err) {
        return reject({ status: 401, message: "Unauthorized" });
      }
      try {
        const userFound = await User.getUser(user.userName);
        if (!userFound) {
          return reject({ status: 401, message: "Unauthorized" });
        }
        resolve(userFound);
      } catch (err) {
        reject({ status: 500, message: err.message });
      }
    });
  });
};

export const authService = {
  register,
  login,
  verify,
};
