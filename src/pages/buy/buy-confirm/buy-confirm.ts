import { MarketService } from './../../../services/market/MarketService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserAccount } from '../../../config/UserAccount';
import { Item } from '../../../model/ItemList';

@IonicPage()
@Component({
  selector: 'page-buy-confirm',
  templateUrl: 'buy-confirm.html',
})
export class BuyConfirmPage {

  public item: Item = new Item();
  public balance: number;
  public afterBalnce: number;
  public toAddress: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private marketService: MarketService, private userAcc: UserAccount,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyConfirmPage');
    this.item = this.navParams.get("item");
    this.toAddress = this.userAcc.getToLocation();
    this.balance = this.userAcc.getBalance();
    this.afterBalnce = this.balance - (this.item.price * this.item.amount);
    console.log("this.item.seller: "+this.item.seller);
    console.log("this.item.sellerLocation: "+this.item.sellerLocation)

    if(this.afterBalnce<0) {
      const alert = this.alertCtrl.create({
        cssClass: 'alertClass',
        subTitle: 'Your wallet balance is not enough!',
        buttons: ['OK']
      })
      alert.present();
      this.navCtrl.setRoot("HomePage");
    }
  }

  confirm() {
    let buyer = this.userAcc.getAddress();
    console.log("this.toAddress: "+this.toAddress);
    this.marketService.buyItem(this.item, buyer, this.toAddress)
    .subscribe(
      (val) => {
          console.log("buyItem call successful value returned in body", val);
          const alert = this.alertCtrl.create({
            cssClass: 'alertClass',
            subTitle: 'The item has been successfully purchased and will ship to your location soon',
            buttons: ['OK']
          })
          alert.present();
          this.navCtrl.setRoot("HomePage");
      },
      response => {
          console.log("buyItem call in error", response);
      },
      () => {
          console.log("The buyItem observable is now completed.");
      });
  }

}
