import { CartItem } from "./cartItem";

export class Order{
  id!: string;
  items!: CartItem[];
  totalprice!: number;
  name!: string;
  address!: string;
}
