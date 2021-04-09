import { UserAccount } from '../../../config/UserAccount';
import { MarketService } from '../../../services/market/MarketService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Item, ItemList } from '../../../model/ItemList';
import { LocationTrackingService } from '../../../services/Location-tracking/LocationTrackingService';
import { Route } from '../../../model/Route';

type LoadItemsResult = {
  result: any,
  hasError: string
}

type GetWaypointsResult = {
  result: any,
  hasWaypointSet: boolean,
  hasError: boolean
}

type ItemsResult = {
  ids: string[],
  names: string[],
  buyerLocations: string[],
  buyers: string[],
  amounts: number[],
  prices: number[],
  shipmentIds: number[],
  count: number
}

@IonicPage()
@Component({
  selector: 'page-ship-list',
  templateUrl: 'ship-list.html',
})
export class ShipListPage {

  public items: ItemList = new Array<Item>();
  public itemCount = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private marketService: MarketService, private locationService: LocationTrackingService,
    private userAcc: UserAccount) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShipListPage');
    this.loadItems();
  }

  loadItems() {
    this.marketService.loadItemsFromSeller(this.userAcc.getAddress())
    .subscribe(
      (val) => {
        console.log("loadItemsFromSeller call successful value returned in body", val);
        let retval: LoadItemsResult = JSON.parse(JSON.stringify(val));
        if(retval.hasError != "false") {
          let itemResult: ItemsResult = JSON.parse(JSON.stringify(retval.result));
          this.itemCount = itemResult.count;
          for(let i=0;i<itemResult.count;i++){
            let it: Item = new Item();
            it.id = itemResult.ids[i];
            it.name = itemResult.names[i];
            it.price = itemResult.prices[i];
            it.buyer = itemResult.buyers[i];
            it.buyerLocation = itemResult.buyerLocations[i];
            it.shipmentId = itemResult.shipmentIds[i];
            it.amount = itemResult.amounts[i]
            this.items.push(it);
          }
       }
      },
      response => {
          console.log("loadItemsFromSeller call in error", response);
      },
      () => {
          console.log("The loadItemsFromSeller observable is now completed.");
      });
  }

  ship(item: Item) {
    console.log("ship-list, item.shipmentId: "+item.shipmentId)
    this.locationService.getWaypoints(item.shipmentId)
    .subscribe(
      (val) => {
        console.log("getWaypoints call successful value returned in body", val);
        let retval: GetWaypointsResult = JSON.parse(JSON.stringify(val));
        console.log("retval.hasError: "+retval.hasError+", retval.hasWaypointSet: "+retval.hasWaypointSet);
        if(!retval.hasError) {
          if(retval.hasWaypointSet) {
            this.navCtrl.push("ShipLocationPage", {
              "item": item
            })
          }else if(!retval.hasWaypointSet){
            item.route = new Route();
            this.navCtrl.push("SetRoutePage", {
              "item": item
            })
          }
        }
      },
      response => {
        console.log("getWaypoints call in error", response);
      },
      () => {
          console.log("The getWaypoints observable is now completed.");
      });
  }

  sliceStr(str) {
    return str.slice(0, 20)+"..."
  }
}
