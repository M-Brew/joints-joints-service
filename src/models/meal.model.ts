import { model, Schema } from "mongoose";

const mealSchema = new Schema(
  {
    name: String,
    description: String,
    mealType: Schema.Types.ObjectId,
    menu: Schema.Types.ObjectId,
    price: Number,
    currency: {
      type: String,
      default: "cedi",
    },
    images: [String],
    createdBy: Schema.Types.ObjectId,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const mealModel = model("Meal", mealSchema);

export default mealModel;
