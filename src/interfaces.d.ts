export interface ISettingItem {
  name: string;
  slug?: string;
  description?: string;
  count?: number;
}

export interface IMeal {
  name: string;
  description?: string;
  mealType: string;
  menu: string;
  price: number;
  currency?: string;
  createdBy: string;
}

export interface IMenu {
  joint: string;
  menuType: string;
  meals?: string[];
  createdBy: string;
}
