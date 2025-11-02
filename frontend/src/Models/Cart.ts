
import { CartItem } from "./Cart-item";

export interface Cart {
   _id?: string;
  username: string;
  items: CartItem[];
}