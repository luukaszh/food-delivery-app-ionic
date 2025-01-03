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
  userid?: string;
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
  { label: 'UNKNOWN', value: 0 },
  { label: 'ACCEPTED', value: 1 },
  { label: 'INPROGRESS', value: 2 },
  { label: 'SENT', value: 3 },
  { label: 'DELIVERED', value: 4 }
];