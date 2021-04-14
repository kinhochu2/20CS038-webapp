import { ProofService } from './../../services/proof/ProofService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

type GetRequestsResult = {
  result: any,
  hasError: string,
  count: number
}

type RequestResult = {
  requestIds: string[],
  sellerLats: string[],
  sellerLngs: string[],
  timestamps: string[]
}

type Request = {
  requestId: string,
  sellerLat: string,
  sellerLng: string,
  timestamp: string
}

@IonicPage()
@Component({
  selector: 'page-request-list',
  templateUrl: 'request-list.html',
})
export class RequestListPage {

  requests: Request[];
  shipmentId: string;
  count: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private proofServ: ProofService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestListPage');
    this.shipmentId = this.navParams.get("shipmentId");
  }

  loadRequests() {
    this.proofServ.getRequests(this.shipmentId)
    .subscribe(
      (val) => {
        console.log("getRequests call successful value returned in body", val);
        let retval: GetRequestsResult = JSON.parse(JSON.stringify(val));
        if(retval.hasError == "false") {
          this.count = retval.count;
          let requestResult: RequestResult = JSON.parse(JSON.stringify(retval.result));
          for(let i=0;i<this.count;i++) {
            let r: Request;
            r.requestId = requestResult.requestIds[i];
            r.sellerLat = requestResult.sellerLats[i];
            r.sellerLng = requestResult.sellerLngs[i];
            r.timestamp = requestResult.timestamps[i];
            this.requests.push(r);
          }
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
}
