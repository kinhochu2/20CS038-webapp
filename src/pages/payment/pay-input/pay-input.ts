import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../../components/ion-digit-keyboard';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-pay-input',
  templateUrl: 'pay-input.html',
})
export class PayInputPage {

  @ViewChild(IonDigitKeyboardCmp) keyboard;
  openKeypad: boolean;
  keyboardSettings: IonDigitKeyboardOptions;

  scannerOptions: BarcodeScannerOptions;
  scannedData: any={};

  protected amount: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public scanner: BarcodeScanner) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayInputPage');
  }
  ngOnInit(): void {
    this.amount = 0;
    this.openKeypad = false;
    this.setKeyboardSettings();
  }

  scan() {
    this.scannerOptions = {
      prompt: "Scan the QR Code"
    }
    this.scanner.scan().then((data)=> {
      this.scannedData = data;
      console.log("Scanned Data: "+data);
    }, (err)=> {
      console.log("Scan error: "+err);
    });
  }

  setKeyboardSettings() {
    this.keyboardSettings = {
      align: 'center',
      width: '100%',
      visible: true,
      leftActionOptions: {
        text: '.',
        fontSize: '1.4em'
      },
      rightActionOptions: {
        iconName: 'backspace',
        fontSize: '1.4em'
      },
      roundButtons: false,
      showLetters: false,
      swipeToHide: true,
      theme: 'light'
    }
  }

  amountClicked() {
    this.openKeypad = !this.openKeypad;
  }

  onKeyboardButtonClick(key: number) {
    this.amount += key;
    console.log(key);
  }

  next() {
    this.navCtrl.push('PayConfirmPage');
  }
}
