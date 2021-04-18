import { Request } from './../model/Request';
import { Item } from './../model/ItemList';
import { Injectable } from '@angular/core';
import { Route } from '../model/Route';

@Injectable()
export class UserAccount {

  private email: string;
  private password: string;
  private address: string;
  private balance: number;
  private toLocation: string;
  private nearestWaypoint: string;
  item: Item;
  requests: Request[] = new Array<Request>();
  activeRequest: Request;
  requestCount = 0;
  constructor() {
    this.nearestWaypoint = "empty";
  }

  resetAccount() {
    this.email = "";
    this.password = "";
    this.address = "";
    this.balance = 0;
    this.toLocation = "";
    this.nearestWaypoint = "empty";
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }

  setAddress(address) {
    this.address = address;
  }

  setBalance(balance) {
    this.balance = balance;
  }

  setToLocation(toLocation) {
    this.toLocation = toLocation;
  }

  setNearestWaypoint(waypoint) {
    this.nearestWaypoint = waypoint;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getAddress() {
    return this.address;
  }

  getBalance() {
    return this.balance;
  }

  getToLocation() {
    return this.toLocation;
  }

  getNearestWaypoint() {
    return this.nearestWaypoint;
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
