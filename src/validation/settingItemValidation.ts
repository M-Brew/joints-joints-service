import { ISettingItem } from "interfaces";

const settingItemValidation = (
  settingItem: ISettingItem
): { valid: boolean; errors: Record<string, string> } => {
  const { name } = settingItem;
  const errors: Record<string, string> = {};

  if (!name || name.trim() === "") {
    errors.name = "name is required";
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { settingItemValidation };
