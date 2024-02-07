import { Router, Request, Response } from "express";

import JointType from "../models/jointType.model";
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
    const existingJointType = await JointType.findOne({ slug });
    if (existingJointType) {
      return res
        .status(400)
        .json({ error: "joint type with name already exists" });
    }

    const newJointType = new JointType({ ...payload, slug });
    const jointType = await newJointType.save();

    return res.status(201).json(jointType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const jointTypes = await JointType.find();

    return res.status(200).json(jointTypes);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const jointType = await JointType.findById(id);
    if (!jointType) {
      return res.status(404).json({ error: "joint type not found" });
    }

    return res.status(200).json(jointType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const jointType = await JointType.findById(id);
    if (!jointType) {
      return res.status(404).json({ error: "joint type not found" });
    }

    const updatedJointType = await JointType.findByIdAndUpdate(id, payload, {
      new: true,
      useFindAndModify: false,
    });

    return res.status(200).json(updatedJointType);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const jointType = await JointType.findById(id);
    if (!jointType) {
      return res.status(404).json({ error: "joint type not found" });
    }

    await JointType.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
