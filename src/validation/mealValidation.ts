import { isValidObjectId } from "mongoose";
import { IMeal } from "interfaces";

const mealValidation = (
  meal: IMeal
): { valid: boolean; errors: Record<string, string> } => {
  const { name, mealType, menu, price, createdBy } = meal;
  const errors: Record<string, string> = {};

  if (!name || name.trim() === "") {
    errors.name = "name is required";
  }

  if (!mealType || mealType.trim() === "") {
    errors.mealType = "meal type is required";
  } else {
    if (!isValidObjectId(mealType)) {
      errors.mealType = "meal type should be valid id";
    }
  }

  if (!menu || menu.trim() === "") {
    errors.menu = "menu is required";
  } else {
    if (!isValidObjectId(menu)) {
      errors.menu = "menu should be valid id";
    }
  }

  if (!price) {
    errors.price = "price is required";
  }

  if (!createdBy || createdBy.trim() === "") {
    errors.createdBy = "created by is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { mealValidation };
