import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ShopResponse } from "../types";

const prisma = new PrismaClient();
const salesRouter = Router();

// Route for getting all available shops
salesRouter.get("/shops", async (req: Request, res: Response) => {
  try {
    const availableShops = await prisma.shop.findMany({
      where: { status: "AVAILABLE" }, // Only available shops
      include: { floor: true }, // Include floor information with the shop
    });
    res.status(200).json(availableShops);
  } catch (error) {
    res.status(500).json({ error: "Error fetching available shops" });
  }
});

// Get shops grouped by floor number
salesRouter.get(
  "/shops/grouped-by-floor",
  async (req: Request, res: Response) => {
    try {
      // Fetch all shops with the related floor information
      const shops = await prisma.shop.findMany({
        include: {
          floor: true, // Include the related floor info
        },
      });

      // Group the shops by their floor number
      const groupedShops = shops.reduce((acc: any, shop) => {
        // Check if the floor already exists in the accumulator
        const floorNumber = shop.floor.floorNumber;
        if (!acc[floorNumber]) {
          acc[floorNumber] = []; // If not, initialize an empty array
        }
        acc[floorNumber].push(shop); // Push the shop to the corresponding floor array
        return acc;
      }, {});

      // Return the grouped shops
      res.status(200).json(groupedShops);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch shops grouped by floor." });
    }
  }
);


// Show all floors
salesRouter.get("/floors", async (req: Request, res: Response) => {
  try {
    const floors = await prisma.floor.findMany();
    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch floors." });
  }
});


// Show all shops
salesRouter.get("/shops", async (req: Request, res: Response) => {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        floor: true, // Include the related floor information
      },
    });
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shops." });
  }
});


// Show available shops
salesRouter.get("/shops/available", async (req: Request, res: Response) => {
  try {
    const availableShops = await prisma.shop.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: {
        floor: true, // Include the related floor information
      },
    });
    res.status(200).json(availableShops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available shops." });
  }
});

// Show available shops grouped by floor number
salesRouter.get("/shops/available/grouped-by-floor", async (req: Request, res: Response) => {
  try {
    const availableShops = await prisma.shop.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: {
        floor: true, // Include the related floor information
      },
    });

    // Group available shops by floor number
    const groupedShops = availableShops.reduce((acc: any, shop) => {
      const floorNumber = shop.floor.floorNumber;
      if (!acc[floorNumber]) {
        acc[floorNumber] = [];
      }
      acc[floorNumber].push(shop);
      return acc;
    }, {});

    res.status(200).json(groupedShops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available shops grouped by floor." });
  }
});

// Show sold rooms grouped by floor number
salesRouter.get("/shops/sold/grouped-by-floor", async (req: Request, res: Response) => {
  try {
    const soldShops = await prisma.shop.findMany({
      where: {
        status: "SOLD",
      },
      include: {
        floor: true, // Include the related floor information
      },
    });

    // Group sold shops by floor number
    const groupedSoldShops = soldShops.reduce((acc: any, shop) => {
      const floorNumber = shop.floor.floorNumber;
      if (!acc[floorNumber]) {
        acc[floorNumber] = [];
      }
      acc[floorNumber].push(shop);
      return acc;
    }, {});

    res.status(200).json(groupedSoldShops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sold rooms grouped by floor." });
  }
});





export default salesRouter;
