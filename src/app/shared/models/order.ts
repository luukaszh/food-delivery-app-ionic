import { LatLng } from "leaflet";
import { CartItem } from "./cartItem";

export class Order {
  id!: string;
  items!: CartItem[];
  totalprice!: number;
  name!: string;
  address!: string;
  addressLatLng?: LatLng;
  paymentId?: string;
  createdAt?: string;
  status?: number;
  foodid?: number[];
}

export class OrderAdd {
  items!: CartItem[];
  totalprice!: number;
  userid!: number;
  name!: string;
  address!: string;
  paymentId?: string;
  status: number = 1;
}

export const ORDER_STATUSES = [
  { label: 'Unknown', value: 0 },
  { label: 'Accepted', value: 1 },
  { label: 'In progress', value: 2 },
  { label: 'Sent', value: 3 },
  { label: 'Delivered', value: 4 }
];