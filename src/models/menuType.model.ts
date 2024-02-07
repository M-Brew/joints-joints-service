import { model, Schema } from "mongoose";

const menuTypeSchema = new Schema(
  {
    name: String,
    slug: String,
    description: String,
    count: {
      type: Number,
      default: 0
    },
    createdBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const menuTypeModel = model("MenuType", menuTypeSchema);

export default menuTypeModel;
