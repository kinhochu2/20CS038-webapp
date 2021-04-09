import { LocationTrackingService } from './../../../services/Location-tracking/LocationTrackingService';
import { UserAccount } from './../../../config/UserAccount';
import { MarketService } from './../../../services/market/MarketService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Item, ItemList } from '../../../model/ItemList';

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
  sellerLocations: string[],
  prices: number[],
  sellers: string[],
  amounts: number[],
  shipmentIds: number[],
  count: number
}

@IonicPage()
@Component({
  selector: 'page-track-list',
  templateUrl: 'track-list.html',
})
export class TrackListPage {

  public items: ItemList = new Array<Item>();
  public itemCount = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private marketService: MarketService, private userAcc: UserAccount,
    private locationServ: LocationTrackingService, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackListPage');
    this.loadItems();
  }

  loadItems() {
    this.marketService.loadItemsFromBuyer(this.userAcc.getAddress())
    .subscribe(
      (val) => {
        console.log("loadItemsFromBuyer call successful value returned in body", val);
        let retval: LoadItemsResult = JSON.parse(JSON.stringify(val));
        if(retval.hasError != "false") {
          let itemResult: ItemsResult = JSON.parse(JSON.stringify(retval.result));
          this.itemCount = itemResult.count;
          for(let i=0;i<itemResult.count;i++){
            let it: Item = new Item();
            it.id = itemResult.ids[i];
            it.name = itemResult.names[i];
            it.price = itemResult.prices[i];
            it.amount = itemResult.amounts[i];
            it.seller = itemResult.sellers[i];
            it.sellerLocation = itemResult.sellerLocations[i];
            it.shipmentId = itemResult.shipmentIds[i];
            this.items.push(it);
          }
       }
      },
      response => {
          console.log("loadItemsFromBuyer call in error", response);
      },
      () => {
          console.log("The loadItemsFromBuyer observable is now completed.");
      });
  }

  track(item: Item) {
    this.locationServ.getWaypoints(item.shipmentId)
    .subscribe(
      (val) => {
        console.log("getWaypoints call successful value returned in body", val);
        let retval: GetWaypointsResult = JSON.parse(JSON.stringify(val));
        console.log("retval.hasError: "+retval.hasError+", retval.hasWaypointSet: "+retval.hasWaypointSet);
        if(!retval.hasError) {
          if(retval.hasWaypointSet) {
            this.navCtrl.push("TrackLocationPage", {
              "item": item
            })
          }else if(!retval.hasWaypointSet){
            const alert = this.alertCtrl.create({
              cssClass: 'alertClass',
              subTitle: 'The seller haven\'t setup the route yet!',
              buttons: ['OK']
            })
            alert.present();
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
