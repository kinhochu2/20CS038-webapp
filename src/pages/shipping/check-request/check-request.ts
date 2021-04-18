import { Item } from './../../../model/ItemList';
import { ProofService } from './../../../services/proof/ProofService';
import { Request } from './../../../model/Request';
import { UserAccount } from './../../../config/UserAccount';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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

  protected requestId: number;
  protected request: Request = new Request("", "", "", "", "", "");
  private item: Item;
  protected encodedData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    protected userAcc: UserAccount, private scanner: BarcodeScanner,
    private proofServ: ProofService, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckRequestPage');
    this.requestId = this.navParams.get("requestId");
    this.item = this.navParams.get("item");
    console.log("this.requestId: "+this.requestId)
    this.loadRequest();
  }

  loadRequest() {
    this.proofServ.loadRequestDetails(this.requestId).subscribe(
      (val) => {
        console.log("loadRequestDetails call successful value returned in body", val);
        this.request = JSON.parse(JSON.stringify(val));
        this.request.requestId = this.requestId;
        console.log("this.request.shipmentId: "+this.request.shipmentId);
      },
      response => {
        console.log("loadRequestDetails call in error", response);
      },
      () => {
          console.log("The loadRequestDetails observable is now completed.");
      });
  }

  broadcastRequest() {
    this.proofServ.submitBlock(this.request.requestId, this.request.preHx, this.userAcc.getAddress())
    .subscribe(
      (val) => {
        console.log("submitBlock call successful value returned in body", val);
        let retval: SubmitBlockResult = JSON.parse(JSON.stringify(val));
        if(!retval.hasError){
          const alert = this.alertCtrl.create({
            cssClass: 'alertClass',
            subTitle: 'The request has been boardcasted to the network.',
            buttons: ['OK']
          })
          alert.present();
          this.navCtrl.setRoot("ShipLocationPage", {
            "item": this.item
          })
        }
      },
      response => {
        console.log("submitBlock call in error", response);
      },
      () => {
          console.log("The submitBlock observable is now completed.");
      });
  }

  showProof() {
    let data = "requestId:"+this.request.requestId;
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, data).then(() => {
      console.log("Encode success: "+data);
      this.encodedData = data;
    }).catch(err => {
      console.log("Encode error: "+err);
    })
  }
}
