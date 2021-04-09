import { UserAccount } from './../../config/UserAccount';
import { HttpProvider } from './../../providers/HttpProvider';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation'
import { Geofence } from '@ionic-native/geofence/ngx';

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
    private geofence: Geofence, private userAcc: UserAccount) {
  }

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
    // data can be a set of coordinates, or an error (if an error occurred).
    //console.log(data.coords.latitude);
    // console.log(data.coords.longitude);
    });
  }


  addGeofence(lat ,lng, name) {
    let fence = {
      id: name+lat+lng, //any unique ID
      latitude:       lat, //center of geofence radius
      longitude:      lng,
      radius:         200, //radius to edge of geofence in meters
      transitionType: 1,
      notification: { //notification settings
          id:             1, //any unique ID
          title:          'You crossed a fence', //notification title
          text:           'You just arrived to' + name, //notification body
          openAppOnClick: true //open app when notification is tapped
      }
    }

    this.geofence.addOrUpdate(fence).then(
      () => console.log('Geofence added'),
      (err) => console.log('Geofence failed to add')
    );

    this.geofence.onTransitionReceived().subscribe(resp => {
      console.log("geofence on transition recieved", resp);
      alert(JSON.stringify(resp));
      this.userAcc.setNearestWaypoint(JSON.stringify(resp));
    });

  }

  removeGeofence() {
    this.geofence.removeAll().then(function () {
      console.log('All geofences successfully removed.');
  }
  , function (error) {
      console.log('Removing geofences failed', error);
  });
  }

  addWaypointToRoute(shipmentId, name1, name2, name3, count) {
    let data = "shipmentId="+shipmentId+"&name1="+name1+"&name2="+name2+"&name3="+name3+"&count="+count;
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
    return this.httpProvider.getMapQuestOpenAPI("geocoding/v1/address?key="+MapQuestKey+"&location="+location);
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
