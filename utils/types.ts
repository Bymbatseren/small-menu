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
export interface Item {
  _id:string
  title?:string
  description?:string
  image?:string
  category?:string
  company?:string
  createdAt?:string;
  price?:number
  isActive?:boolean;
  updatedAt?:string
}
export type Props = {
  params: {
    id: string;
  };
};
export interface Toast {
    id: number;
    message: string;
    type: "success" | "error";
}