import { model, Schema } from "mongoose";

const menuSchema = new Schema(
  {
    joint: {
      type: Schema.Types.ObjectId,
      ref: "Joint",
    },
    menuType: {
      type: Schema.Types.ObjectId,
      ref: "MenuType",
    },
    meals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Meal",
      },
    ],
    createdBy: Schema.Types.ObjectId,
    lastUpdatedBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const menuModel = model("Menu", menuSchema);

export default menuModel;
