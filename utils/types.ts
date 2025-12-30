import { Types } from "mongoose";
export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  label: string;
}
export interface Step2InputProps {
  setStep: (step: number) => void;
}
export interface Category {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  isActive: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}
export interface MenuPageProps {
  searchParams?: {
    category?: string;
  };
}
export interface MenuItemProps {
  item: {
    _id: string;
    title: string;
    description: string | null;
    price: number;
    image: string | null;
    isActive: boolean;
    company: string;


    category: {
      _id: string;
      name: string;
      slug?: string | null;
    } | null;


    categoryName?: string;

    createdAt: string;
    updatedAt: string;
  };
}
export interface CategoryDTO {
  _id: string;
  name: string;
  slug: string | null;
  order?: number;
  createdAt: string;
  updatedAt: string;
}


export interface CategoryDoc {
  _id: Types.ObjectId;
  name: string;
  slug?: string | null;
  isActive?: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemType {
  _id: string
  title?: string
  description?: string
  image?: string
  category?: string
  company?: string
  createdAt?: string;
  price?: number
  isActive?: boolean;
  updatedAt?: string
}
export type Props = {
  params: {
    id: string;
  };
};
export interface ItemDoc {
  _id: any;
  title: string;
  description?: string | null;
  image?: string | null;
  price: number;
  isActive: boolean;
  company: any;
  category?: {
    _id: any;
    name: string;
    slug?: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateItemInput {
  title: string;
  description?: string | null;
  image?: string | null;
  price: number | string
  isActive: boolean;
  category?: string | null;
}
export interface UpdateItemInput {
  title?: string;
  description?: string | null;
  image?: string | null;
  price?: number | string; // form-с string ирж магадгүй
  isActive?: boolean;
  category?: string | null;
}
export interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}