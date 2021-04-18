import { Request } from './../../../model/Request';
import { ProofService } from './../../../services/proof/ProofService';
import { UserAccount } from './../../../config/UserAccount';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Item } from '../../../model/ItemList';
import { rootRenderNodes } from '@angular/core/src/view';
// import sha256 from 'crypto-js/sha256';
// import aes from 'crypto-js/aes';
import CryptoJS from 'crypto-js';

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
    protected userAcc: UserAccount, private proofService: ProofService,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateRequestPage');
    this.proverLat = this.navParams.get("currentLat");
    this.proverLng = this.navParams.get("currentLng");
    this.item = this.navParams.get("item");
    //this.preHx = this.item.route.getLatestBlockHx();
  }

  createRequest() {
    if(this.password != this.userAcc.getPassword()){
      const alert = this.alertCtrl.create({
        cssClass: 'alertClass',
        subTitle: 'Please enter the correct password.',
        buttons: ['OK']
      })
      alert.present();
      return;
    }
    //let encodedPW = sha256(this.userAcc.getPassword());
    let encodedPW = CryptoJS.SHA256(this.password).toString();
    let r: Request = new Request(this.userAcc.requestCount, this.item.shipmentId, this.userAcc.getAddress(), this.proverLat, this.proverLng, new Date);
    this.userAcc.requests.push(r);

    this.proofService.createRequest(this.item.shipmentId, this.proverLat, this.proverLng
      , this.item.seller, this.preHx, encodedPW)
      .subscribe(
        (val) => {
            console.log("createRequest call successful value returned in body", val);
            let retval: CreateRequestResult = JSON.parse(JSON.stringify(val));
            //this.item.route.requests.push(new Request(retval.requestId, retval.hashCode, this.preHx, this.item.seller, this.proverLat, this.proverLng));
            const alert = this.alertCtrl.create({
              cssClass: 'alertClass',
              subTitle: 'The request has been created',
              buttons: ['OK']
            })
            alert.present();
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
