import { Request } from './Request';

export class Route {

  waypoints: Array<string>;
  expectedTime: Date;
  distance: number;
  nearestWaypoint: string;
  requests: Array<Request>;
  latestBlockHx: string;

  constructor() {
    this.waypoints = new Array<string>();
    this.requests = new Array<Request>();
  }

  addWaypoint(waypoint) {
    this.waypoints.push(waypoint);
  }

  getWaypointStr() {
    let str = "";
    for(let i=0;i<3;i++) {
      if(!!this.waypoints[i]) {
        str = str + this.waypoints[i] + ', ';
      }
    }
    return str;
  }

  checkActiveRequest() {
    for(let i=0;i<this.requests.length;i++) {
      if(this.requests[i].isActive()) {
        return this.requests[i];
      }
    }
    return null;
  }

  getLatestBlockHx() {
    if(!!this.requests[this.requests.length-1]){
      return this.requests[this.requests.length-1].signedHx;
    }else {
      return "null";
    }
  }
}
