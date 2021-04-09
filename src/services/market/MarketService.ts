import { Item } from './../../model/ItemList';
import { HttpProvider } from './../../providers/HttpProvider';
import { Injectable } from '@angular/core';

@Injectable()
export class MarketService {

  constructor(private httpProvider: HttpProvider) {
  }

  loadItems() {
    return this.httpProvider.getRequest("market/loaditems")
  }

  loadItemsFromBuyer(address: string) {
    return this.httpProvider.getRequest("market/loaditemsfrombuyer?address="+address);
  }

  loadItemsFromSeller(address: string) {
    return this.httpProvider.getRequest("market/loaditemsfromseller?address="+address);
  }

  buyItem(item: Item, buyer: string, toAddress: string) {
    return this.httpProvider.postRequest("market/buyitem",
    "itemId="+item.id+"&itemAmount="+item.amount+"&buyer="+buyer+"&buyerLocation="+toAddress);
  }

  addItem(item: Item, seller: string) {
    return this.httpProvider.postRequest("market/additem",
    "name="+item.name+"&price="+item.price+"&seller="+seller+"&location="+item.sellerLocation);
  }

  finishShipping(shipmentId, seller, buyer, value, password) {
    let data = "shipmentId="+shipmentId+"&seller="+seller+"&buyer="+buyer+"&value="+value+"&password="+password;
    return this.httpProvider.postRequest("market/finishshipping", data);
  }
}
