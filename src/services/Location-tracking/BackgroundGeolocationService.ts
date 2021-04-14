import { localServer } from '../../providers/HttpURL';
import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';

import BackgroundGeolocation, {
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
} from "cordova-background-geolocation-lt";

@Injectable()
export class BackgroundGeolocationService {

  constructor(public platform: Platform) {
    platform.ready().then(this.configureBackgroundGeolocation.bind(this));
  }

  configureBackgroundGeolocation() {
    // 1.  Listen to events.
    BackgroundGeolocation.onLocation(location => {
      console.log('[location] - ', location);
    });

    BackgroundGeolocation.onMotionChange(event => {
      console.log('[motionchange] - ', event.isMoving, event.location);
    });

    BackgroundGeolocation.onHttp(response => {
      console.log('[http] - ', response.success, response.status, response.responseText);
    });

    BackgroundGeolocation.onProviderChange(event => {
      console.log('[providerchange] - ', event.enabled, event.status, event.gps);
    });

    BackgroundGeolocation.onGeofencesChange(event => {
      console.log('[geofencechange] - ', event.on, event.off);
    });

    BackgroundGeolocation.onGeofence(geofence => {
      console.log("[geofence] ", geofence.identifier, geofence.action);
    });

    // 2.  Configure the plugin with #ready
    BackgroundGeolocation.ready({
      reset: true,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      url: localServer,
      autoSync: true,
      stopOnTerminate: false,
      startOnBoot: true,
      forceReloadOnGeofence: true,
    }, (state) => {
      console.log('[ready] BackgroundGeolocation is ready to use');
      if (!state.enabled) {
        // 3.  Start tracking.
        BackgroundGeolocation.startGeofences();
      }
    });
  }

  addGeofence(name,lat , lng) {
    BackgroundGeolocation.addGeofence({
      identifier: name,
      radius: 200,
      latitude: lat,
      longitude: lng,
      notifyOnEntry: true,
      notifyOnExit: false,
    }).then((success) => {
      console.log("[addGeofence] success");
    }).catch((error) => {
      console.log("[addGeofence] FAILURE: ", error);
    });
  }

  removeGeofences() {
    BackgroundGeolocation.removeGeofences(function() {
      console.log("Successfully removed alll geofences");
    }, function(error) {
      console.warn("Failed to remove geofence", error);
    });
  }

  getGenfences() {
    return BackgroundGeolocation.getGeofences();
  }
}
