import { Router, Request, Response } from "express";

import MenuType from "../models/menuType.model";
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
    const existingMenuType = await MenuType.findOne({ slug });
    if (existingMenuType) {
      return res
        .status(400)
        .json({ error: "menu type with name already exists" });
    }

    const newMenuType = new MenuType({ ...payload, slug });
    const menuType = await newMenuType.save();

    return res.status(201).json(menuType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const menuTypes = await MenuType.find();

    return res.status(200).json(menuTypes);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const menuType = await MenuType.findById(id);
    if (!menuType) {
      return res.status(404).json({ error: "menu type not found" });
    }

    return res.status(200).json(menuType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const menuType = await MenuType.findById(id);
    if (!menuType) {
      return res.status(404).json({ error: "menu type not found" });
    }

    const updatedMenuType = await MenuType.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    return res.status(200).json(updatedMenuType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const menuType = await MenuType.findById(id);
    if (!menuType) {
      return res.status(404).json({ error: "menu type not found" });
    }

    await MenuType.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
