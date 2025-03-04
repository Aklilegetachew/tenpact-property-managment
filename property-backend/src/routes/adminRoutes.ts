import { Router } from "express";
import { Request, Response } from "express-serve-static-core";
import { PrismaClient } from "@prisma/client";
import { FloorRequest, ShopRequest } from "../types";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const adminRouter = Router();

// Route for adding a new Floor
adminRouter.post("/floors", async (req: Request, res: Response) => {
  const { name, floorNumber } = req.body;

  try {
    // Create a new floor
    const newFloor = await prisma.floor.create({
      data: {
        name,
        floorNumber,
      },
    });
    res.status(201).json(newFloor);
  } catch (error) {
    res.status(500).json({ error: "Error creating floor" });
  }
});

// Route for adding a new Shop
adminRouter.post("/shops", async (req: Request, res: Response) => {
  const { shopNumber, size, floorId } = req.body;

  try {
    // Create a new shop
    const newShop = await prisma.shop.create({
      data: {
        shopNumber,
        size,
        floorId,
      },
    });
    res.status(201).json(newShop);
  } catch (error) {
    res.status(500).json({ error: "Error creating shop" });
  }
});

// Route for deleting a Floor
adminRouter.delete("/floors/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  try {
    // First, delete all shops associated with this floor
    await prisma.shop.deleteMany({
      where: {
        floorId: id,
      },
    });

    // Now delete the floor itself
    const deletedFloor = await prisma.floor.delete({
      where: {
        id,
      },
    });

    res
      .status(200)
      .json({ message: "Floor deleted successfully", deletedFloor });
  } catch (error) {
    res.status(500).json({ error: "Error deleting floor" });
  }
});

// Route for deleting a Shop
adminRouter.delete("/shops/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete the shop
    const deletedShop = await prisma.shop.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Shop deleted successfully", deletedShop });
  } catch (error) {
    res.status(500).json({ error: "Error deleting shop" });
  }
});

// Route for editing Shop Floor
adminRouter.put("/shops/:id/floor", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { floorId } = req.body; // The new floor ID for the shop

  try {
    // Update the shop's floor
    const updatedShop = await prisma.shop.update({
      where: {
        id,
      },
      data: {
        floorId,
      },
    });

    res
      .status(200)
      .json({ message: "Shop floor updated successfully", updatedShop });
  } catch (error) {
    res.status(500).json({ error: "Error updating shop floor" });
  }
});

// Route for editing Shop Availability (Available or Sold)
adminRouter.put("/shops/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // New status (AVAILABLE or SOLD)

  try {
    // Update the shop's availability status
    const updatedShop = await prisma.shop.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    res
      .status(200)
      .json({ message: "Shop status updated successfully", updatedShop });
  } catch (error) {
    res.status(500).json({ error: "Error updating shop status" });
  }
});

// Route for editing Shop Size
adminRouter.put("/shops/:id/size", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { size } = req.body; // New size for the shop

  try {
    // Update the shop's size
    const updatedShop = await prisma.shop.update({
      where: {
        id,
      },
      data: {
        size,
      },
    });

    res
      .status(200)
      .json({ message: "Shop size updated successfully", updatedShop });
  } catch (error) {
    res.status(500).json({ error: "Error updating shop size" });
  }
});

// Route for editing Shop Number
adminRouter.put("/shops/:id/number", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { shopNumber } = req.body; // New shop number

  try {
    // Update the shop's number
    const updatedShop = await prisma.shop.update({
      where: {
        id,
      },
      data: {
        shopNumber,
      },
    });

    res
      .status(200)
      .json({ message: "Shop number updated successfully", updatedShop });
  } catch (error) {
    res.status(500).json({ error: "Error updating shop number" });
  }
});

// Create User (Admin only)
adminRouter.post("/users", async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Get All Users (Admin only)
adminRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Update User Role (Admin only)
adminRouter.put("/users/:id/role", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body; // New role for the user

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user role" });
  }
});

// Delete User (Admin only)
adminRouter.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Admin Login
adminRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
       res.status(404).json({ error: "User not found" });
    }

    // Check if the user is an admin
    if (user?.role !== "ADMIN") {
       res.status(403).json({ error: "Not authorized" });
    }

    // Compare password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user!.password);
    if (!isPasswordValid) {
       res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token for the admin
    const token = jwt.sign(
      { id: user?.id, email: user?.email, role: user?.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    // Send the token to the client
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default adminRouter;
