import { ProofService } from './../../../services/proof/ProofService';
import { UserAccount } from './../../../config/UserAccount';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Item } from '../../../model/ItemList';
import { Request } from '../../../model/Request';

type CreateRequestResult = {
  requestId: string;
  hashCode: string;
}

@IonicPage()
@Component({
  selector: 'page-create-request',
  templateUrl: 'create-request.html',
})
export class CreateRequestPage {

  protected proverLat: string;
  protected proverLng: string;
  protected item: Item;
  protected password: string;
  protected preHx: string;
  encodedData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    protected userAcc: UserAccount, private proofService: ProofService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateRequestPage');
    this.proverLat = this.navParams.get("currentLat");
    this.proverLng = this.navParams.get("currentLng");
    this.item = this.navParams.get("item");
    this.preHx = this.item.route.getLatestBlockHx();
  }

  createRequest() {
    this.proofService.createRequest(this.item.shipmentId, this.proverLat, this.proverLng
      , this.item.seller, this.preHx, this.password)
      .subscribe(
        (val) => {
            console.log("createRequest call successful value returned in body", val);
            let retval: CreateRequestResult = JSON.parse(JSON.stringify(val));
            this.item.route.requests.push(new Request(retval.requestId, retval.hashCode, this.preHx, this.item.seller, this.proverLat, this.proverLng));
            this.navCtrl.setRoot("ShipLocationPage", {
              "item": this.item
            });
          },
          response => {
              console.log("createRequest call in error", response);
          },
          () => {
              console.log("The createRequest observable is now completed.");
          });
  }


}
