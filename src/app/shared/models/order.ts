import { LatLng } from "leaflet";
import { CartItem } from "./cartItem";

export class Order {
  id!: string;
  items!: CartItem[];
  totalPrice!: number;
  name!: string;
  address!: string;
  addressLatLng?: LatLng;
  paymentId?: string;
  createdAt?: string;
  status?: string;
}

export class OrderAdd {
  items!: CartItem[];
  totalprice!: number;
  name!: string;
  address!: string;
  paymentId?: string;
}