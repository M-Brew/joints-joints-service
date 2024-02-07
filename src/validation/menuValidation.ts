import { IMenu } from "interfaces";

const menuValidation = (
  menu: IMenu
): { valid: boolean; errors: Record<string, string> } => {
  const { joint, menuType, createdBy } = menu;
  const errors: Record<string, string> = {};

  if (!joint || joint.trim() === "") {
    errors.joint = "joint is required";
  }

  if (!menuType || menuType.trim() === "") {
    errors.menuType = "menu type is required";
  }

  if (!createdBy || createdBy.trim() === "") {
    errors.createdBy = "created by is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { menuValidation };
