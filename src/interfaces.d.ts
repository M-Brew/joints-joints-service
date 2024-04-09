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

export interface IJoint {
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  gallery?: string[];
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string[];
  menu?: string;
  createdBy: string;
}
