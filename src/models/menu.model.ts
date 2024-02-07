import { model, Schema } from "mongoose";

const menuSchema = new Schema(
  {
    joint: Schema.Types.ObjectId,
    menuType: Schema.Types.ObjectId,
    meals: [Schema.Types.ObjectId],
    createdBy: Schema.Types.ObjectId,
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
