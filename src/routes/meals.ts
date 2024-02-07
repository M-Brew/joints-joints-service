import { Router, Request, Response } from "express";

import Meal from "../models/meal.model";
import { mealValidation } from "../validation/mealValidation";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = mealValidation(payload);
    if (!valid) {
      return res.status(400).json(errors);
    }

    const newMeal = new Meal(payload);
    const meal = await newMeal.save();

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
      return res.status(404).json({ error: "meal not found" });
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
      return res.status(404).json({ error: "meal not found" });
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
      return res.status(404).json({ error: "meal not found" });
    }

    await Meal.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
