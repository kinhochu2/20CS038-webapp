import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../../components/ion-digit-keyboard';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the PayConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pay-confirm',
  templateUrl: 'pay-confirm.html',
})
export class PayConfirmPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayConfirmPage');
  }

  confirm() {
    this.navCtrl.setRoot("PayCompletePage");
  }
  back() {
    this.navCtrl.pop();
  }
}
