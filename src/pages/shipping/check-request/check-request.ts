import { Item } from './../../../model/ItemList';
import { ProofService } from './../../../services/proof/ProofService';
import { Request } from './../../../model/Request';
import { UserAccount } from './../../../config/UserAccount';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

type SubmitBlockResult = {
  hasError: boolean;
  hxCode: string;
}

@IonicPage()
@Component({
  selector: 'page-check-request',
  templateUrl: 'check-request.html',
})
export class CheckRequestPage {

  protected request: Request;
  private item: Item;
  protected encodedData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    protected userAcc: UserAccount, private scanner: BarcodeScanner,
    private proofServ: ProofService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckRequestPage');
    this.request = this.navParams.get("request");
  }

  broadcastRequest() {
    this.proofServ.submitBlock(this.request.requestId, this.request.preHx)
    .subscribe(
      (val) => {
        console.log("submitBlock call successful value returned in body", val);
        let retval: SubmitBlockResult = JSON.parse(JSON.stringify(val));
        if(!retval.hasError)
          this.item.route.latestBlockHx = retval.hxCode;
        this.navCtrl.setRoot("ShipLocationPage", {
          "item": this.item
        })
      },
      response => {
        console.log("submitBlock call in error", response);
      },
      () => {
          console.log("The submitBlock observable is now completed.");
      });
  }

  showProof() {
    let data = this.request.requestId;
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, data).then(() => {
      console.log("Encode success: "+data);
      this.encodedData = data;
    }).catch(err => {
      console.log("Encode error: "+err);
    })
  }
}
