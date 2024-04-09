import { Router, Request, Response } from "express";
import dotenv from "dotenv";

import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

import Joint from "../models/joint.model";
import JointType from "../models/jointType.model";
import { slugify } from "../utils/slugify";
import { jointValidation } from "../validation/jointValidation";
import { s3 } from "../utils/s3";
import { isValidObjectId } from "mongoose";

dotenv.config();

const { S3_BUCKET_NAME } = process.env;

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const { valid, errors } = jointValidation(payload);
    if (!valid) {
      return res.status(400).json(errors);
    }

    const slug = slugify(payload.name);
    const existingJoint = await Joint.findOne({ slug });
    if (existingJoint) {
      return res.status(400).json({ error: "Joint with name already exists" });
    }

    const jointTypeIds = payload.type.split(",").map((id: string) => id.trim());
    const phone = payload.phone.split(",").map((p: string) => p.trim());

    const newJoint = new Joint({
      ...payload,
      slug,
      type: jointTypeIds,
      phone,
    });
    const joint = await newJoint.save();

    if (joint) {
      jointTypeIds.map(
        async (id: string) =>
          await JointType.findByIdAndUpdate(
            id,
            { $inc: { count: 1 } },
            {
              new: true,
              useFindAndModify: false,
            }
          )
      );
    }

    return res.status(201).json(joint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const joints = await Joint.find().populate({
      path: "type",
      select: "name",
    });

    return res.status(200).json(joints);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const joint = isValidObjectId(id)
      ? await Joint.findById(id).populate({
          path: "type",
          select: "name",
        })
      : await Joint.findOne({ slug: id }).populate({
          path: "type",
          select: "name",
        });

    if (!joint) {
      return res.status(404).json({ error: "Joint not found" });
    }

    return res.status(200).json(joint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const joint = await Joint.findById(id);
    if (!joint) {
      return res.status(404).json({ error: "Joint not found" });
    }

    let slug = joint.slug;

    if (payload.name) {
      slug = slugify(payload.name);
      const existingJoint = await Joint.findOne({
        _id: { $ne: id },
        slug,
      });
      if (existingJoint) {
        return res
          .status(400)
          .json({ error: "Joint with name already exists" });
      }
    }

    const updatedJoint = await Joint.findByIdAndUpdate(
      id,
      { ...payload, slug },
      {
        new: true,
        useFindAndModify: false,
      }
    ).populate({
      path: "type",
      select: "name",
    });

    return res.status(200).json(updatedJoint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const joint = await Joint.findById(id);
    if (!joint) {
      return res.status(404).json({ error: "Joint not found" });
    }

    joint.type.map(
      async (id: any) =>
        await JointType.findByIdAndUpdate(
          id,
          { $inc: { count: -1 } },
          {
            new: true,
            useFindAndModify: false,
          }
        )
    );

    const imageKeys: { Key: string }[] = [];
    if (joint.avatar) {
      imageKeys.push({ Key: joint.avatar.key });
    }
    if (joint.gallery?.length > 0) {
      joint.gallery.map((item) => {
        imageKeys.push({ Key: item.key });
      });
    }

    if (imageKeys.length > 0) {
      const command = new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Delete: {
          Objects: imageKeys,
        },
      });

      await s3.send(command);
    }

    await Joint.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

// avatar

router.post("/:id/avatar", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updatedJoint = await Joint.findByIdAndUpdate(
      id,
      { avatar: { key: payload.key, imageURL: payload.imageURL } },
      {
        new: true,
        useFindAndModify: false,
      }
    ).populate({
      path: "type",
      select: "name",
    });

    return res.status(200).json(updatedJoint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id/avatar", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const joint = await Joint.findById(id);
    if (!joint) {
      return res.status(404).json({ error: "Joint not found" });
    }

    if (joint.avatar.key) {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: joint.avatar.key,
      });

      await s3.send(command);
    }

    const updatedJoint = await Joint.findByIdAndUpdate(
      id,
      { avatar: null },
      {
        new: true,
        useFindAndModify: false,
      }
    ).populate({
      path: "type",
      select: "name",
    });

    return res.status(200).json(updatedJoint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

// gallery

router.post("/:id/gallery-image", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updatedJoint = await Joint.findByIdAndUpdate(
      id,
      { $push: { gallery: { key: payload.key, imageURL: payload.imageURL } } },
      {
        new: true,
        useFindAndModify: false,
      }
    ).populate({
      path: "type",
      select: "name",
    });

    return res.status(200).json(updatedJoint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete(
  "/:id/gallery-image/:key",
  async (req: Request, res: Response) => {
    try {
      const { id, key } = req.params;

      const joint = await Joint.findById(id);
      if (!joint) {
        return res.status(404).json({ error: "Joint not found" });
      }

      const galleryImages = joint.gallery;
      const image = galleryImages.find((i) => i.key === key);

      if (image?.key) {
        const command = new DeleteObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: image.key,
        });

        await s3.send(command);
      }

      const updatedGallery = galleryImages.filter(
        (i) => i.key !== key
      );

      const updatedJoint = await Joint.findByIdAndUpdate(
        id,
        { gallery: updatedGallery },
        {
          new: true,
          useFindAndModify: false,
        }
      ).populate({
        path: "type",
        select: "name",
      });

      return res.status(200).json(updatedJoint);
    } catch (error) {
      res.sendStatus(500);
      throw new Error(error);
    }
  }
);

// menu

router.post("/:id/menu", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!isValidObjectId(payload.menu)) {
      return res.status(400).json({ error: "menu must be a valid menu id" });
    }

    const joint = await Joint.findById(id);
    if (!joint) {
      return res.status(404).json({ error: "Joint not found" });
    }

    const updatedJoint = await Joint.findByIdAndUpdate(
      id,
      { menu: joint.menu ? [...joint.menu, payload.menu] : [payload.menu] },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(200).json(updatedJoint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

router.delete("/:id/menu", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (!isValidObjectId(payload.menu)) {
      return res.status(400).json({ error: "menu must be a valid menu id" });
    }

    const joint = await Joint.findById(id);
    if (!joint) {
      return res.status(404).json({ error: "Joint not found" });
    }

    const menu = joint.menu.find((m) => m === payload.menu);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    const updatedMenu = joint.menu.filter((m) => m !== menu);

    const updatedJoint = await Joint.findByIdAndUpdate(
      id,
      { menu: updatedMenu },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    return res.status(200).json(updatedJoint);
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

export default router;
