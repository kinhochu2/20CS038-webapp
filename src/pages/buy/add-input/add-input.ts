import { Item } from './../../../model/ItemList';
import { MarketService } from './../../../services/market/MarketService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserAccount } from '../../../config/UserAccount';


@IonicPage()
@Component({
  selector: 'page-add-input',
  templateUrl: 'add-input.html',
})
export class AddInputPage {

  public item: Item = new Item();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private marketService: MarketService, private alertCtrl: AlertController,
    protected userAcc: UserAccount) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInputPage');
  }

  addItem() {
    let seller = this.userAcc.getAddress();
    this.item.sellerLocation = this.userAcc.getToLocation();
    this.marketService.addItem(this.item, seller)
    .subscribe(
      (val) => {
          console.log("addItem call successful value returned in body", val);
          const alert = this.alertCtrl.create({
            cssClass: 'alertClass',
            subTitle: 'The item has been added to the list.',
            buttons: ['OK']
          })
          alert.present();
          this.navCtrl.setRoot("BuyInputPage");
      },
      response => {
          console.log("addItem call in error", response);
      },
      () => {
          console.log("The addItem observable is now completed.");
      });
  }
}
