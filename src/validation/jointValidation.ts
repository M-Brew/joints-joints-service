import { IJoint } from "interfaces";
import { isValidObjectId } from "mongoose";

const jointValidation = (
  joint: IJoint
): { valid: boolean; errors: Record<string, string> } => {
  const {
    name,
    type,
    address,
    createdBy,
  } = joint;
  const errors: Record<string, string> = {};

  if (!name || name.trim() === "") {
    errors.name = "name is required";
  }

  if (!type || type.trim() === "") {
    errors.type = "type is required";
  } else {
    type.split(",").map((t: string) => {
      if (!isValidObjectId(t.trim())) {
        errors.type = "type should be valid type id";
      }
    });
  }

  if (!address || address.trim() === "") {
    errors.address = "address is required";
  }

  if (!createdBy || createdBy.trim() === "") {
    errors.createdBy = "created by is required";
  } else {
    if (!isValidObjectId(createdBy)) {
      errors.createdBy = "created by should be valid id";
    }
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { jointValidation };
