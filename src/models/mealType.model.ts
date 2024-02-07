import { model, Schema } from "mongoose";

const mealTypeSchema = new Schema(
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

const mealTypeModel = model("MealType", mealTypeSchema);

export default mealTypeModel;
