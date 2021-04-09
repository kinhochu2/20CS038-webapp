import { Route } from '../../../model/Route';
import { Item } from '../../../model/ItemList';
import { LocationTrackingService } from '../../../services/Location-tracking/LocationTrackingService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserAccount } from '../../../config/UserAccount';

interface FindWaypointResult {
  waypoints: [{
    name: string;
    lat: number;
    lng: number;
  }];
  count: number;
  distance: number;
}

type AddWaypointToRouteResult = {
  hasError: boolean;
}

@IonicPage()
@Component({
  selector: 'page-reset-route',
  templateUrl: 'reset-route.html',
})
export class ResetRoutePage {

  protected item: Item;
  waypoint: Array<string> = new Array<string>();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private locationService: LocationTrackingService, private userAcc: UserAccount,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetRoutePage');
    this.item.route = new Route();
    this.item = this.navParams.get("item");
    this.item.sellerLocation = this.userAcc.getToLocation();
  }

  submitRoute() {
    if(this.waypoint.length>0){
      let names: Array<string> = new Array<string>(3);
      for(let i=0;i<3;i++) {
        if(this.waypoint[i] != ""){
          this.item.route.addWaypoint(this.waypoint[i]);
          names[i] = this.waypoint[i];
        }
      }
      this.locationService.addWaypointToRoute(this.item.shipmentId, names[0],names[1],names[2],this.item.route.waypoints.length)
      .subscribe(
        (val) => {
            console.log("addWaypointToRoute call successful value returned in body", val);
            const alert = this.alertCtrl.create({
              cssClass: 'alertClass',
              subTitle: 'The calculated waypoints are: <br>'+this.item.route.getWaypointStr(),
              buttons: ['OK']
            })
            alert.present();
            this.navCtrl.push("ShipLocationPage", {
              "item": this.item,
              "route": this.item.route
            });
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
                //this.locationService.addGeofence(retval.waypoints[i].lat, retval.waypoints[i].lng, retval.waypoints[i].name);
              }
            }
            this.item.route.distance = retval.distance;
            this.locationService.addWaypointToRoute(this.item.shipmentId, names[0],names[1],names[2],retval.count)
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
                    this.navCtrl.push("ShipLocationPage", {
                      "item": this.item,
                      "route": this.item.route
                    });
                  }
                },
                response => {
                    console.log("addWaypointToRoute call in error", response);
                })
        },
        response => {
            console.log("findWaypoints call in error", response);
        })
    }
  }

}
