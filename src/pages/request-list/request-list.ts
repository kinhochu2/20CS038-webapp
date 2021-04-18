import { Item } from './../../model/ItemList';
import { UserAccount } from './../../config/UserAccount';
import { Request } from './../../model/Request';
import { ProofService } from './../../services/proof/ProofService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

type GetRequestsResult = {
  result: any,
  hasError: boolean,
  count: number
}

type RequestResult = {
  requestIds: string[],
  sellerLats: string[],
  sellerLngs: string[],
  timestamps: string[]
}

@IonicPage()
@Component({
  selector: 'page-request-list',
  templateUrl: 'request-list.html',
})
export class RequestListPage {

  requests: Request[] = new Array<Request>();
  shipmentId: string;
  count: number = 0;
  item: Item;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private proofServ: ProofService, protected userAcc: UserAccount) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestListPage');
    this.shipmentId = this.navParams.get("shipmentId");
    this.item = this.navParams.get("item");
    this.loadRequests();
  }

  loadRequests() {
    this.proofServ.getRequests(this.shipmentId)
    .subscribe(
      (val) => {
        console.log("getRequests call successful value returned in body", val);
        let retval: GetRequestsResult = JSON.parse(JSON.stringify(val));
        console.log("retval.hasError: "+retval.hasError);
        if(!retval.hasError) {
          this.count = retval.count;
          let requestResult: RequestResult = JSON.parse(JSON.stringify(retval.result));
          for(let i=0;i<this.count;i++) {
            console.log("requestResult.requestIds[i]: "+requestResult.requestIds[i]);
            let r: Request = new Request(requestResult.requestIds[i], this.shipmentId, this.userAcc.getAddress(),
            requestResult.sellerLats[i], requestResult.sellerLngs[i], requestResult.timestamps[i]);
            this.requests.push(r);
          }
          console.log("this.requests: "+this.requests);
          console.log("this.requests.length: "+this.requests.length);
        }
      },
      response => {
          console.log("getRequests call in error", response);
      },
      () => {
          console.log("The getRequests observable is now completed.");
      });
  }

  checkResponses(request: Request){
    this.navCtrl.push("ResponseListPage", {
      "requestId": request.requestId
    })
  }

  checkDetails(request: Request) {
    this.navCtrl.push("CheckRequestPage", {
      "requestId": request.requestId,
      "item": this.item
    })
  }
}
