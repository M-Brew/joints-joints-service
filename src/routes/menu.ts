import { Router, Request, Response } from "express";
import mongoose from "mongoose";

import Menu from "../models/menu.model";
import { menuValidation } from "../validation/menuValidation";
import Joint from "../models/joint.model";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = menuValidation(payload);
    if (!valid) {
      return res.status(400).json(errors);
    }

    const existingJoint = await Joint.findById(payload.joint);
    if (!existingJoint) {
      return res.status(404).json({ error: "joint does not exist" });
    }

    if (existingJoint.createdBy.toString() !== payload.createdBy) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const existingMenu = await Menu.findOne({
      joint: payload.joint,
      menuType: payload.menuType,
    });
    if (existingMenu) {
      return res
        .status(400)
        .json({ error: `menu with menu type already exists` });
    }

    const newMenu = new Menu(payload);
    const menu = await newMenu.save();

    await Joint.findByIdAndUpdate(payload.joint, {
      $push: { menu: menu._id },
    });

    return res.status(201).json(menu);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const menus = await Menu.find().populate([
      {
        path: "joint",
        select: "name",
      },
      {
        path: "menuType",
        select: "name",
      },
      "meals",
    ]);

    return res.status(200).json(menus);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id).populate([
      {
        path: "joint",
        select: "name",
      },
      {
        path: "menuType",
        select: "name",
      },
      "meals",
    ]);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    return res.status(200).json(menu);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/joint/:jointId", async (req: Request, res: Response) => {
  try {
    const { jointId } = req.params;

    const existingJoint = await Joint.findById(jointId);
    if (!existingJoint) {
      return res.status(404).json({ error: "joint does not exist" });
    }

    const menus = await Menu.find({ joint: jointId }).populate([
      {
        path: "joint",
        select: "name",
      },
      {
        path: "menuType",
        select: "name",
      },
      "meals",
    ]);

    return res.status(200).json(menus);
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
      return res.status(404).json({ error: "Menu not found" });
    }

    const existingJoint = await Joint.findById(payload.joint);
    if (!existingJoint) {
      return res.status(404).json({ error: "joint does not exist" });
    }

    if (existingJoint.createdBy !== payload.createdBy) {
      return res.status(401).json({ error: "unauthorized" });
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
      return res.status(404).json({ error: "Menu not found" });
    }

    await Joint.findByIdAndUpdate(menu.joint, { $pull: { menu: id } });

    await Menu.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
