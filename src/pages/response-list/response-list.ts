import { Response } from './../../model/Response';
import { ProofService } from './../../services/proof/ProofService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

type GetResponsesResult = {
  result: any,
  hasError: boolean,
  count: number
}

type ResponseResult = {
  witnessAddrs: string[],
  witnessLats: string[],
  witnessLngs: string[],
  timestamps: string[]
}
@IonicPage()
@Component({
  selector: 'page-response-list',
  templateUrl: 'response-list.html',
})
export class ResponseListPage {

  responses: Response[] = new Array<Response>();
  requestId: string;
  count: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private proofServ: ProofService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestListPage');
    this.requestId = this.navParams.get("requestId");
    this.loadResponses();
  }

  loadResponses() {
    this.proofServ.getResponses(this.requestId)
    .subscribe(
      (val) => {
        console.log("getResponses call successful value returned in body", val);
        let retval: GetResponsesResult = JSON.parse(JSON.stringify(val));
        if(!retval.hasError) {
          this.count = retval.count;
          let responseResult: ResponseResult = JSON.parse(JSON.stringify(retval.result));
          for(let i=0;i<this.count;i++) {
            let r: Response = new Response(this.requestId, responseResult.witnessAddrs[i],
              responseResult.witnessLats[i], responseResult.witnessLngs[i], responseResult.timestamps[i]);
            this.responses.push(r);
          }
        }
      },
      response => {
          console.log("getResponses call in error", response);
      },
      () => {
          console.log("The getResponses observable is now completed.");
      });
  }
}
