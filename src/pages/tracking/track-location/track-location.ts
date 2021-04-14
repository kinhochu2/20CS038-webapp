import { MarketService } from './../../../services/market/MarketService';
import { LocationTrackingService } from './../../../services/Location-tracking/LocationTrackingService';
import { UserAccount } from './../../../config/UserAccount';
import { Item } from './../../../model/ItemList';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Route } from '../../../model/Route';

declare var L: any;

const MapQuestKey = '2sdNBLXdUDfxllrLzrxrNuuO9l1DGtt0';

type GetLocationResult = {
  lat: string;
  lng: string;
}

type GetShipmentDetailsResult = {
  sellerLocation: string;
  buyerLocation: string;
  waypointSet: boolean;
  waypoints: string[];
  distance: string;
  eta: string;
  time: string;
}

type GeocodingResult = {
  lat: number;
  lng: number;
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
  public distance: string;
  public eta: string;
  public time: string;

  private centerCoords = {
    lat: 22.302711,
    lng: 114.177216
  }

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
        this.distance = retval.distance.substring(0, 4);
        this.eta = retval.eta;
        this.time = retval.time;
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
          this.map = this.initMaps(this.centerCoords.lat, this.centerCoords.lng);
          this.setRoute(this.item.sellerLocation, this.item.buyerLocation, this.item.waypoints);
          this.addMarker(retval.lat,  retval.lng, "The seller is here");
        },
        response => {
          console.log("getLocation call in error", response);
        },
        () => {
            console.log("The getLocation observable is now completed.");
        });
        for(let i=0;i<this.item.waypoints.length;i++) {
          this.locationServ.geocoding(this.item.waypoints[i])
          .subscribe(
            (val) => {
                console.log("geocoding call successful value returned in body", val);
                let retval: GeocodingResult = JSON.parse(JSON.stringify(val));
                L.circle([retval.lat, retval.lng], { radius: 200 }).addTo(this.map);
            },
            response => {
                console.log("geocoding call in error", response);
            })
         }
    }
  }

  initMaps(lat, lng) {
    L.mapquest.key = MapQuestKey;
    var map = L.mapquest.map('map', {
      center: [lat, lng],
      layers: L.mapquest.tileLayer('dark'), //'map'
      zoom: 13
    });
    return map;
  }

  setRoute(start: string, end: string, waypoints) {
    L.mapquest.key = MapQuestKey;
    L.mapquest.directions().route({
      start: start,
      end: end,
      waypoints: waypoints
    });
  }

  addMarker(lat, lng, text) {
    let fg = L.featureGroup();
    L.mapquest.textMarker([lat,lng], {
      text: text,
      position: 'right',
      type: 'marker',
      icon: {
      primaryColor: '#a8333d',
      secondaryColor: '#333333',
      size: 'sm'
      },
      draggable: false
    }).addTo(this.map);
  }

  checkRequests() {
    console.log("this.item.shipmentId"+this.item.shipmentId);
    this.navCtrl.push("RequestListPage", {
      "shipmentId": this.item.shipmentId
    })
  }
}


