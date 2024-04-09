import { Router, Request, Response } from "express";
import dotenv from "dotenv"

import Meal from "../models/meal.model";
import MealType from "../models/mealType.model";
import Menu from "../models/menu.model";
import { mealValidation } from "../validation/mealValidation";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3";

dotenv.config();

const { S3_BUCKET_NAME } = process.env;

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = mealValidation(payload);
    if (!valid) {
      return res.status(400).json(errors);
    }

    const existingMealType = await MealType.findById(payload.mealType);
    if (!existingMealType) {
      return res.status(404).json({ error: "meal type does not exist" });
    }

    const existingMenu = await Menu.findById(payload.menu);
    if (!existingMenu) {
      return res.status(404).json({ error: "menu does not exist" });
    }

    if (existingMenu.createdBy.toString() !== payload.createdBy) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const newMeal = new Meal(payload);
    const meal = await newMeal.save();

    await Menu.findByIdAndUpdate(payload.menu, { $push: { meals: meal._id } });
    await MealType.findByIdAndUpdate(payload.mealType, { $inc: { count: 1 } });

    return res.status(201).json(meal);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const meals = await Meal.find();

    return res.status(200).json(meals);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    return res.status(200).json(meal);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    return res.status(200).json(updatedMeal);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    await Meal.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.post("/:id/image", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { image: { key: payload.key, imageURL: payload.imageURL } },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(200).json(updatedMeal);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id/image", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    if (meal.image.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: meal.image.key,
      });

      await s3.send(command);
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { image: null },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(200).json(updatedMeal);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
