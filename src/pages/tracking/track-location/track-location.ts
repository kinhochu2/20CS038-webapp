import { MarketService } from './../../../services/market/MarketService';
import { LocationTrackingService } from './../../../services/Location-tracking/LocationTrackingService';
import { UserAccount } from './../../../config/UserAccount';
import { Item } from './../../../model/ItemList';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Route } from '../../../model/Route';

type GetLocationResult = {
  lat: string;
  lng: string;
}

type GetShipmentDetailsResult = {
  sellerLocation: string;
  buyerLocation: string;
  waypointSet: boolean;
  waypoints: string[];
}

@IonicPage()
@Component({
  selector: 'page-track-location',
  templateUrl: 'track-location.html',
})
export class TrackLocationPage {

  public item: Item = new Item();
  public toLocation: string;
  public map: any;
  public waypointSet;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private locationServ: LocationTrackingService, private userAcc: UserAccount) {
  }

  ionViewDidLoad() {
    this.item.route = new Route()
    console.log('ionViewDidLoad TrackLocationPage');
    this.item = this.navParams.get("item");
    this.item.route = this.navParams.get("route");
    this.item.buyerLocation = this.userAcc.getToLocation();
    this.item.buyer = this.userAcc.getAddress();
    this.getShipmentDetails();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  getShipmentDetails() {
    this.locationServ.getShipmentDetails(this.item.shipmentId)
    .subscribe(
      (val) => {
        console.log("getShipmentDetails call successful value returned in body", val);
        let retval: GetShipmentDetailsResult = JSON.parse(JSON.stringify(val));
        this.item.sellerLocation = retval.sellerLocation;
        this.item.buyerLocation = retval.buyerLocation;
        this.item.route.waypoints = retval.waypoints;
        this.waypointSet = retval.waypointSet;
      },
      response => {
        console.log("getShipmentDetails call in error", response);
      },
      () => {
          console.log("The getShipmentDetails observable is now completed.");
      });
  }

  initMap() {
    console.log("initing Map");
    const container = document.getElementById('map');

    // 'map' refers to a <div> element with the ID map
    if(container) {
      console.log("container is not null");
       this.locationServ.getLocation(this.item.seller)
       .subscribe(
        (val) => {
          console.log("getLocation call successful value returned in body", val);
          let retval: GetLocationResult = JSON.parse(JSON.stringify(val));
          //this.map = this.locationServ.initMap(this.map, retval.lat, retval.lng);
          this.map = this.locationServ.setRoute(this.map, this.item.sellerLocation, this.item.buyerLocation, this.item.route.waypoints);
          this.map = this.locationServ.addMarker(this.map, retval.lat, retval.lng, "The seller is here");
        },
        response => {
          console.log("getLocation call in error", response);
        },
        () => {
            console.log("The getLocation observable is now completed.");
        });
    }
  }

}


