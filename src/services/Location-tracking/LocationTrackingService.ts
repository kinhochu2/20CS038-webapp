import { UserAccount } from './../../config/UserAccount';
import { HttpProvider } from './../../providers/HttpProvider';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation'
//import { Geofence } from '@ionic-native/geofence/ngx'

declare var L: any;

type GeocodingResult = {
  lat: string;
  lng: string;
}

const MapQuestKey = '2sdNBLXdUDfxllrLzrxrNuuO9l1DGtt0';

@Injectable()
export class LocationTrackingService {
  private centerCoords = {
    lat: 22.302711,
    lng: 114.177216
  }

  constructor(private httpProvider: HttpProvider, private geolocation: Geolocation,
    private userAcc: UserAccount,
    // private geofence: Geofence
    ) {
      // this.geofence.initialize().then(function () {
      //     console.log("Successful initialization");
      // }, function (error) {
      //     console.log("Error", error);
      // });
  }

  // addGeofence(id, lat, lng) {
  //   this.geofence.addOrUpdate({
  //     id:             id, //A unique identifier of geofence
  //     latitude:       lat, //Geo latitude of geofence
  //     longitude:      lng, //Geo longitude of geofence
  //     radius:         200, //Radius of geofence in meters
  //     transitionType: 1, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
  //     notification: {         //Notification object
  //         title:          "EthsyShip", //Title of notification
  //         text:           "You have reach "+id, //Text of notification
  //         openAppOnClick: true,//is main app activity should be opened after clicking on notification
  //     }
  //   }).then(function () {
  //       console.log('Geofence successfully added');
  //   }, function (error) {
  //       console.log('Adding geofence failed', error);
  //   });

  // }

  // removeGeofences() {
  //   this.geofence.removeAll().then(function () {
  //     console.log('Geofence successfully removed');
  //   }, function (error) {
  //       console.log('Removing geofence failed', error);
  //   });
  // }

  async getCurrentLocation() {
    let coords = {
      lat: this.centerCoords.lat,
      lng: this.centerCoords.lng
    };
    await this.geolocation.getCurrentPosition().then((resp) => {
      coords.lat = resp.coords.latitude;
      coords.lng = resp.coords.longitude;
     }).catch((error) => {
      console.log('Error getting location', error);
     });

     return coords;
  }

  initMap(map, lat, lng) {
    if(map != undefined) {
      map.off();
      map.remove();
    }
    if(map == null) {
      L.mapquest.key = MapQuestKey;
      map = L.mapquest.map('map', {
        center: [lat, lng],
        layers: L.mapquest.tileLayer('dark'), //'map'
        zoom: 13
      });
    }
    return map;
  }

  addMarker(map, lat, lng, text) {
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
    }).addTo(map);
    return map;
  }

  setRoute(map, start: string, end: string, waypoints: Array<string>) {
    if(map != undefined) {
      map.off();
      map.remove();
    }
    if(map == null) {
      L.mapquest.key = MapQuestKey;
      L.mapquest.directions().route({
        start: start,
        end: end,
        waypoints: waypoints
      }, this.directionsCallback);
    }
    return map;
  }

  directionsCallback(error, response) {
    console.log("directionsCallback response: "+response);
    L.mapquest.key = MapQuestKey;
    var map = L.mapquest.map('map', {
      center: [this.centerCoords.lat,this.centerCoords.lng],
      layers: L.mapquest.tileLayer('dark'),
      zoom: 7
    });

    let directionsLayer = L.mapquest.directionsLayer({
      directionsResponse: response
    }).addTo(map);
    return map;
  }

  setMapCenter(map) {
    map = L.mapquest.map('map', {
      center: [this.centerCoords.lat, this.centerCoords.lng],
      layers: L.mapquest.tileLayer('dark'), //'map'
      zoom: 13
    });
    return map;
  }

  watchPosition() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log(data.toString());
    });
  }

  addWaypointToRoute(shipmentId, name1, name2, name3, count, start, end, mph) {
    let data = "shipmentId="+shipmentId+"&name1="+name1+"&name2="+name2+"&name3="+name3+"&count="+count+"&start="+start+"&end="+end+"&mph="+mph;
    return this.httpProvider.postRequest("tracking/addwaypoints",data);
  }

  getWaypoints(shipmentId: number) {
    return this.httpProvider.getRequest("tracking/getshipmentwaypoints?shipmentId="+shipmentId);
  }

  findWaypoints(sellerLocation: string, buyerLocation: string) {
    let data = "sellerLocation="+sellerLocation+"&buyerLocation="+buyerLocation;
    return this.httpProvider.postRequest("tracking/findwaypoints", data);
  }

  geocoding(location) {
    let data = "location="+location;
    return this.httpProvider.postRequest("tracking/geocoding", data);
  }

  updateLocation(lat, lng) {
    let data = "address="+this.userAcc.getAddress()+"&lat="+lat+"&lng="+lng;
    return this.httpProvider.postRequest("tracking/updatelocation", data)
  }

  getLocation(address) {
    let data = "address="+address;
    return this.httpProvider.postRequest("tracking/getlocation", data)
  }

  getShipmentDetails(shipmentId) {
    return this.httpProvider.getRequest("tracking/getshipmentdetails?shipmentId="+shipmentId);
  }

}
