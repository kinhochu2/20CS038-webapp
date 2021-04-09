import { ProofService } from './../../../services/proof/ProofService';
import { MarketService } from './../../../services/market/MarketService';
import { UserAccount } from './../../../config/UserAccount';
import { Item } from './../../../model/ItemList';
import { LocationTrackingService } from './../../../services/Location-tracking/LocationTrackingService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Route } from '../../../model/Route';

declare var L: any;

type GetShipmentDetailsResult = {
  sellerLocation: string;
  buyerLocation: string;
  waypointSet: boolean;
  waypointName: string[];
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private locationServ: LocationTrackingService, protected userAcc: UserAccount,
    private marketServ: MarketService, private alertCtrl: AlertController,
    private proofServ: ProofService) {
  }


  ionViewDidLoad() {
    this.item.route = new Route();
    console.log('ionViewDidLoad ShipLocationPage');
    this.item = this.navParams.get("item");
    this.item.route = this.navParams.get("route");
    this.item.seller = this.userAcc.getAddress();
    this.item.sellerLocation = this.userAcc.getToLocation();
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
        this.item.route = new Route();
        this.item.waypoints = retval.waypointName;
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
        //this.map = this.locationServ.initMap(this.map, result.lat, result.lng);
        this.map = this.locationServ.setRoute(this.map, this.item.sellerLocation, this.item.buyerLocation, this.item.waypoints);
        this.map = this.locationServ.addMarker(this.map, this.currentLat, this.currentLng, "You are here");

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
    }
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
}
