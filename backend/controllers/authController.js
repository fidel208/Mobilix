import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId, role = "CUSTOMER") => {
  return jwt.sign(
    { userId, role },
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

    const token = generateToken(newUser.id, newUser.role || "CUSTOMER");
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
    const token = generateToken(user.id, user.role || "CUSTOMER");
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

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(admin.id, admin.role || "ADMIN");
    const { password: _, ...adminWithoutPassword } = admin;

    return res.status(200).json({
      status: "success",
      message: "Admin logged in successfully!",
      token,
      user: adminWithoutPassword,
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during admin login.",
    });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        status: "error",
        message: "An admin with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    const { password: _, ...adminWithoutPassword } = newAdmin;

    return res.status(201).json({
      status: "success",
      message: "New admin registered successfully!",
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during admin registration.",
    });
  }
};
