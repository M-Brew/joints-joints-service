import { model, Schema } from "mongoose";

const imageSchema = new Schema({
  imageURL: String,
  key: String
})

const mealSchema = new Schema(
  {
    name: String,
    description: String,
    mealType: {
      type: Schema.Types.ObjectId,
      ref: "MealType",
    },
    menu: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
    price: Number,
    currency: {
      type: String,
      default: "cedi",
    },
    image: imageSchema,
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

const mealModel = model("Meal", mealSchema);

export default mealModel;
