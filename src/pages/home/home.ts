import { AuthService } from './../../services/auth/AuthService';
import { UserAccount } from './../../config/UserAccount';
import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, MenuController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

type GetBalanceResult = {
  address: string;
  balance: number;
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  protected histroyItems = {};
  protected balance: number;
  protected address: string;

  constructor(public navCtrl: NavController,
     public alertCtrl: AlertController,
     public clipboard: Clipboard,
     public menuCtrl: MenuController,
     private navParams: NavParams,
     protected userAcc: UserAccount,
     private scanner: BarcodeScanner,
     private authService: AuthService) {

  }

  ngOnInit(): void {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad(){
    this.getBalance();
  }

  scan() {
    this.scanner.scan({
      prompt: "Please scan the QR code.",
      preferFrontCamera: false,
      showFlipCameraButton: false,
      showTorchButton: true,
      disableSuccessBeep: false
    }).then(data => {
      if(!!data)
        this.navCtrl.push('CreateResponsePage', {
          "requestId": data
        });
    })
  }

  copy() {
    this.clipboard.copy(this.userAcc.getAddress());
    const alert = this.alertCtrl.create({
      cssClass: 'alertClass',
      subTitle: 'Your public address has been copied to clipboard.',
      buttons: ['OK']
    })
    alert.present();
  }

  goToPage(pageID){
    this.navCtrl.push(pageID);
  }

  getBalance() {
    this.authService.getBalance(this.userAcc.getAddress())
    .subscribe(
      (val) => {
        console.log("getBalance call successful value returned in body", val);
        let retval: GetBalanceResult = JSON.parse(JSON.stringify(val));
        this.balance = retval.balance;
        this.userAcc.setBalance(this.balance);
      },
      response => {
        console.log("getBalance call in error", response);
      },
      () => {
        console.log("The getBalance observable is now completed.");
    });
  }

  sliceStr(str) {
    return str.slice(0, 20)+"..."
  }
}
