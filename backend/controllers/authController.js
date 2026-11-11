import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "mobilix_super_secret_key",
    {
      expiresIn: "24h",
    },
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(newUser.id);
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      status: "success",
      message: "Account created successfully!",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during registration.",
    });
  }
};

export const login = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      status: "success",
      message: "Logged in successfully!",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during login.",
    });
  }
};
