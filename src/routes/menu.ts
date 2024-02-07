import { Router, Request, Response } from "express";

import Menu from "../models/menu.model";
import { menuValidation } from "../validation/menuValidation";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = menuValidation(payload);
    if (!valid) {
      return res.status(400).json(errors);
    }

    const newMenu = new Menu(payload);
    const menu = await newMenu.save();

    return res.status(201).json(menu);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const menus = await Menu.find();

    return res.status(200).json(menus);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ error: "menu not found" });
    }

    return res.status(200).json(menu);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ error: "menu not found" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    return res.status(200).json(updatedMenu);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ error: "menu not found" });
    }

    await Menu.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
