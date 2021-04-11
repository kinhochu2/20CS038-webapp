import { ProofService } from './../../../services/proof/ProofService';
import { LocationTrackingService } from './../../../services/Location-tracking/LocationTrackingService';
import { UserAccount } from './../../../config/UserAccount';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

type LoadRequestDetailsResult = {
  proverLat: string;
  proverLng: string;
  hasError: boolean;
  timestamp: string;
  shipmentId: string
}

@IonicPage()
@Component({
  selector: 'page-create-response',
  templateUrl: 'create-response.html',
})
export class CreateResponsePage {

  protected requestId: string;
  protected proverLat: string;
  protected proverLng: string;
  protected proverAddr: string;
  protected witnessLat: number;
  protected witnessLng: number;
  protected timestamp: string;
  protected password: string;
  protected shipmentId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    protected userAcc: UserAccount, private locationServ: LocationTrackingService,
    private proofService: ProofService, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateResponsePage');
    this.requestId = this.navParams.get("requestId");
    this.proverAddr = this.navParams.get("proverAddr");
    this.locationServ.getCurrentLocation().then((val) => {
      this.witnessLat = val.lat;
      this.witnessLng = val.lng;
    });
    this.loadRequestDetails(this.requestId);
  }

  loadRequestDetails(requestId) {
    this.proofService.loadRequestDetails(requestId)
    .subscribe(
      (val) => {
          console.log("loadRequestDetails call successful value returned in body", val);
          let retval: LoadRequestDetailsResult = JSON.parse(JSON.stringify(val));
          if(!retval.hasError) {
            this.proverLat = retval.proverLat;
            this.proverLng = retval.proverLng;
            this.timestamp = retval.timestamp;
            this.shipmentId = retval.shipmentId;
          }
        },
        response => {
            console.log("loadRequestDetails call in error", response);
        },
        () => {
            console.log("The loadRequestDetails observable is now completed.");
        });
  }

  createResponse() {
    if(this.password != this.userAcc.getPassword()){
      const alert = this.alertCtrl.create({
        cssClass: 'alertClass',
        subTitle: 'The item amount cannot be less than one.',
        buttons: ['OK']
      })
      alert.present();
      return;
    }
    this.proofService.addResponse(this.requestId, this.shipmentId, this.witnessLat, this.witnessLng, this.userAcc.getAddress(), this.password)
    .subscribe(
      (val) => {
          console.log("addResponse call successful value returned in body", val);
      },
      response => {
          console.log("addResponse call in error", response);
      },
      () => {
          console.log("The addResponse observable is now completed.");
      });
  }
}
