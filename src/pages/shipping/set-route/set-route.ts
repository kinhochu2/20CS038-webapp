import { BackgroundGeolocationService } from '../../../services/Location-tracking/BackgroundGeolocationService';
import { Route } from '../../../model/Route';
import { Item } from './../../../model/ItemList';
import { LocationTrackingService } from './../../../services/Location-tracking/LocationTrackingService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserAccount } from '../../../config/UserAccount';

type FindWaypointResult = {
  waypoints: [{
    name: string;
    lat: number;
    lng: number;
  }];
  count: number;
}

type AddWaypointToRouteResult = {
  distance: string;
  time: string;
  eta: string;
  hasError: boolean;
}

type GeocodingResult = {
  lat: number;
  lng: number;
}

@IonicPage()
@Component({
  selector: 'page-set-route',
  templateUrl: 'set-route.html',
})
export class SetRoutePage {

  protected item: Item = new Item();
  waypoint: Array<string> = new Array<string>();
  speed: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private locationService: LocationTrackingService, private userAcc: UserAccount,
    private alertCtrl: AlertController,
    private bgGeo: BackgroundGeolocationService
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetRoutePage');
    this.item.route = new Route();
    this.item = this.navParams.get("item");
    this.item.sellerLocation = this.userAcc.getToLocation();
  }

  submitRoute() {
    if(this.waypoint.length>0){
      let names: Array<string> = new Array<string>(3);
      for(let i=0;i<3;i++) {
        if(!!this.waypoint[i] && this.waypoint[i] != ""){
          this.item.route.addWaypoint(this.waypoint[i]);
          names[i] = this.waypoint[i];
          this.locationService.geocoding(this.waypoint[i])
          .subscribe(
            (val) => {
                console.log("geocoding call successful value returned in body", val);
                let retval: GeocodingResult = JSON.parse(JSON.stringify(val));
                this.bgGeo.addGeofence(this.waypoint[i], retval.lat, retval.lng)
                //this.locationService.addGeofence(this.waypoint[i], retval.lat, retval.lng)
            },
            response => {
                console.log("geocoding call in error", response);
            })
        }
      }
      this.locationService.addWaypointToRoute(this.item.shipmentId, names[0],names[1],names[2],this.item.route.waypoints.length, this.item.sellerLocation, this.item.buyerLocation, this.speed)
      .subscribe(
        (val) => {
            console.log("addWaypointToRoute call successful value returned in body", val);
            let retval: AddWaypointToRouteResult = JSON.parse(JSON.stringify(val))
            if(!retval.hasError){
              const alert = this.alertCtrl.create({
                cssClass: 'alertClass',
                subTitle: 'The calculated waypoints are: <br>'+this.item.route.getWaypointStr(),
                buttons: ['OK']
              })
              alert.present();
              this.navCtrl.setRoot("ShipLocationPage", {
                "item": this.item,
                "route": this.item.route
              });
            }
          },
          response => {
              console.log("addWaypointToRoute call in error", response);
          })
    }else {
      this.locationService.findWaypoints(this.item.sellerLocation, this.item.buyerLocation)
      .subscribe(
        (val) => {
            console.log("findWaypoints call successful value returned in body", val);
            let retval: FindWaypointResult = JSON.parse(JSON.stringify(val));
            let names: Array<string> = new Array<string>(3);
            for(let i=0;i<retval.count;i++) {
              if(!!retval.waypoints[i]) {
                this.item.route.addWaypoint(retval.waypoints[i].name);
                names[i] = retval.waypoints[i].name;
                this.bgGeo.addGeofence(retval.waypoints[i].name, retval.waypoints[i].lat, retval.waypoints[i].lng)
                //this.locationService.addGeofence(retval.waypoints[i].name, retval.waypoints[i].lat, retval.waypoints[i].lng)
              }
            }
            this.locationService.addWaypointToRoute(this.item.shipmentId, names[0],names[1],names[2],retval.count, this.item.sellerLocation, this.item.buyerLocation, this.speed)
            .subscribe(
              (val) => {
                  console.log("addWaypointToRoute call successful value returned in body", val);
                  let retval: AddWaypointToRouteResult = JSON.parse(JSON.stringify(val))
                  if(!retval.hasError){
                    const alert = this.alertCtrl.create({
                      cssClass: 'alertClass',
                      subTitle: 'The calculated waypoints are: <br>'+this.item.route.getWaypointStr(),
                      buttons: ['OK']
                    })
                    alert.present();
                    this.navCtrl.setRoot("ShipLocationPage", {
                      "item": this.item,
                      "route": this.item.route
                    });
                  }
                },
                response => {
                    console.log("findWaypoints call in error", response);
                })
        },
        response => {
            console.log("findWaypoints call in error", response);
        })
    }
  }


}
