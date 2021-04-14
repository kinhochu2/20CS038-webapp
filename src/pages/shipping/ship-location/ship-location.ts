import { ProofService } from './../../../services/proof/ProofService';
import { MarketService } from './../../../services/market/MarketService';
import { UserAccount } from './../../../config/UserAccount';
import { Item } from './../../../model/ItemList';
import { LocationTrackingService } from './../../../services/Location-tracking/LocationTrackingService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Route } from '../../../model/Route';
import { BackgroundGeolocationService } from '../../../services/Location-tracking/BackgroundGeolocationService';

declare var L: any;

const MapQuestKey = '2sdNBLXdUDfxllrLzrxrNuuO9l1DGtt0';

type GetShipmentDetailsResult = {
  sellerLocation: string;
  buyerLocation: string;
  waypointSet: boolean;
  waypointName: string[];
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
  selector: 'page-ship-location',
  templateUrl: 'ship-location.html',
})
export class ShipLocationPage {

  public item: Item = new Item();
  public map: any;
  public currentLat;
  public currentLng;
  protected encodedData;
  public distance: string;
  public eta: string;
  public time: string;

  private centerCoords = {
    lat: 22.302711,
    lng: 114.177216
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private locationServ: LocationTrackingService, protected userAcc: UserAccount,
    private marketServ: MarketService, private alertCtrl: AlertController,
    private proofServ: ProofService, private bgGeo: BackgroundGeolocationService) {
  }


  ionViewDidLoad() {
    this.item.route = new Route();
    console.log('ionViewDidLoad ShipLocationPage');
    this.item = this.navParams.get("item");
    this.item.route = this.navParams.get("route");
    this.item.seller = this.userAcc.getAddress();
    this.item.sellerLocation = this.userAcc.getToLocation();
    this.getShipmentDetails();

    var intervalId = setInterval(function() {
      this.locationServ.updateLocation(this.currentLat, this.currentLng)
        .subscribe(
          (val) => {
            console.log("updateLocation call successful value returned in body", val);
          },
          response => {
            console.log("updateLocation call in error", response);
          },
          () => {
              console.log("The updateLocation observable is now completed.");
          });
    }, 60000);
    console.log("intervalId: "+intervalId.toString());
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
        this.item.route = new Route();
        this.item.waypoints = retval.waypointName;
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
       this.locationServ.getCurrentLocation().then((result) => {
        this.currentLat= result.lat;
        this.currentLng= result.lng;
        if (this.map != undefined) { this.map.remove(); }
        this.map = this.initMaps(this.centerCoords.lat, this.centerCoords.lng);
        this.setRoute(this.item.sellerLocation, this.item.buyerLocation, this.item.waypoints);
        this.addMarker( this.currentLat, this.currentLng, "You are here");
        this.locationServ.updateLocation(this.currentLat, this.currentLng)
        .subscribe(
          (val) => {
            console.log("updateLocation call successful value returned in body", val);
          },
          response => {
            console.log("updateLocation call in error", response);
          },
          () => {
              console.log("The updateLocation observable is now completed.");
          });
       })
       console.log("this.item.waypoints.length: "+this.item.waypoints.length);
       for(let i=0;i<this.item.waypoints.length;i++) {
         console.log("geocoding begin");
        this.locationServ.geocoding(this.item.waypoints[i])
        .subscribe(
          (val) => {
              console.log("geocoding call successful value returned in body", val);
              let retval: GeocodingResult = JSON.parse(JSON.stringify(val));
              L.circle([retval.lat, retval.lng], { radius: 200 }).addTo(this.map);
              console.log("Circle added.");
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

  createRequest() {
    this.navCtrl.push("CreateRequestPage", {
      "currentLat": this.currentLat,
      "currentLng": this.currentLng,
      "item": this.item
    });
  }

  checkRequest(request: any) {
    this.navCtrl.push("CheckRequestPage", {
      "request": request,
      "item": this.item
    });
  }

  resetRoute() {
    this.navCtrl.push("ResetRoutePage", {
      "item": this.item
    })
  }

  finishShipping() {
    this.marketServ.finishShipping(this.item.shipmentId, this.item.seller, this.item.buyer, this.item.amount*this.item.price, this.userAcc.getPassword())
    .subscribe(
      (val) => {
        console.log("finishShipping call successful value returned in body", val);
        this.verifyBlock();
        this.bgGeo.removeGeofences();
        const alert = this.alertCtrl.create({
          cssClass: 'alertClass',
          subTitle: 'The shipment is finished and your payment is settled.',
          buttons: ['OK']
        })
        alert.present();
        this.navCtrl.setRoot("HomePage");
      },
      response => {
        console.log("finishShipping call in error", response);
      },
      () => {
          console.log("The finishShipping observable is now completed.");
      });
  }

  verifyBlock(){
    this.proofServ.verifyBlocks(this.item.route.latestBlockHx, this.item.route.requests.length)
    .subscribe(
      (val) => {
        console.log("verifyBlocks call successful value returned in body", val);
      },
      response => {
        console.log("verifyBlocks call in error", response);
      },
      () => {
          console.log("The verifyBlocks observable is now completed.");
      });
  }

  checkRequests() {
    console.log("this.item.shipmentId"+this.item.shipmentId);
    this.navCtrl.push("RequestListPage", {
      "shipmentId": this.item.shipmentId
    })
  }
}
