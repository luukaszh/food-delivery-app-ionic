import { CartItem } from "./cartItem";

export class Cart {
  items: CartItem[] = [];
  totalprice: number = 0;
  totalCount: number = 0;
}
