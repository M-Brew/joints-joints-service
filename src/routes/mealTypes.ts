import { Router, Request, Response } from "express";

import MealType from "../models/mealType.model";
import { settingItemValidation } from "../validation/settingItemValidation";
import { slugify } from "../utils/slugify";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = settingItemValidation(payload);
    if (!valid) {
      return res.status(400).json(errors);
    }

    const slug = slugify(payload.name);
    const existingMealType = await MealType.findOne({ slug });
    if (existingMealType) {
      return res
        .status(400)
        .json({ error: "Meal type with name already exists" });
    }

    const newMealType = new MealType({
      name: payload.name,
      slug,
      description: payload.description,
      count: 0,
      createdBy: payload.createdBy,
      lastUpdatedBy: payload.lastUpdatedBy
    });
    const mealType = await newMealType.save();

    return res.status(201).json(mealType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const mealTypes = await MealType.find();

    return res.status(200).json(mealTypes);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mealType = await MealType.findById(id);
    if (!mealType) {
      return res.status(404).json({ error: "Meal type not found" });
    }

    return res.status(200).json(mealType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const mealType = await MealType.findById(id);
    if (!mealType) {
      return res.status(404).json({ error: "Meal type not found" });
    }

    const updatedMealType = await MealType.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    return res.status(200).json(updatedMealType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mealType = await MealType.findById(id);
    if (!mealType) {
      return res.status(404).json({ error: "Meal type not found" });
    }

    await MealType.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
