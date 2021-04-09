import { Route } from "./Route";

export class Item {
  id: string;
  name: string;
  price: number;
  seller: string;
  sellerLocation: string;
  buyer: string;
  buyerLocation: string;
  paid: boolean;
  amount: number;
  shipmentId: number;
  route: Route;
  waypoints: Array<string>;

  constructor() {
    this.route = new Route();
    this.waypoints = new Array<string>();
  }
}

export type ItemList = Array<Item>;
