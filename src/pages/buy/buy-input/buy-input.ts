import { UserAccount } from './../../../config/UserAccount';
import { MarketService } from './../../../services/market/MarketService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Item, ItemList } from '../../../model/ItemList';

type LoadItemsResult = {
  result: any,
  hasError: string
}

type ItemsResult = {
  ids: string[],
  names: string[],
  locations: string[],
  prices: number[],
  sellers: string[],
  count: number
}

@IonicPage()
@Component({
  selector: 'page-buy-input',
  templateUrl: 'buy-input.html',
})

export class BuyInputPage {

  public items: ItemList = new Array<Item>();
  public itemCount = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private marketService: MarketService, private alertCtrl: AlertController,
    private userAcc: UserAccount) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyInputPage');
    this.loadItems();
  }

  loadItems() {
    this.marketService.loadItems()
    .subscribe(
      (val) => {
        console.log("loadItems call successful value returned in body", val);
        let retval: LoadItemsResult = JSON.parse(JSON.stringify(val));
        if(retval.hasError != "false") {
          let itemResult: ItemsResult = JSON.parse(JSON.stringify(retval.result));
          this.itemCount = itemResult.count;
          for(let i=0;i<itemResult.count;i++){
            let it: Item = new Item();
            it.id = itemResult.ids[i];
            it.name = itemResult.names[i];
            it.price = itemResult.prices[i];
            it.seller = itemResult.sellers[i];
            it.sellerLocation = itemResult.locations[i];
            it.amount = 1;
            this.items[i] = it;
          }
       }
      },
      response => {
          console.log("loadItems call in error", response);
      },
      () => {
          console.log("The loadItems observable is now completed.");
      });
  }

  buyItem(i: Item) {
    if(i.amount < 1){
      const alert = this.alertCtrl.create({
        cssClass: 'alertClass',
        subTitle: 'The item amount cannot be less than one.',
        buttons: ['OK']
      })
      alert.present();
      return;
    }
    if(i.seller == this.userAcc.getAddress()){
      const alert = this.alertCtrl.create({
        cssClass: 'alertClass',
        subTitle: 'The item buyer cannot be same as the seller.',
        buttons: ['OK']
      })
      alert.present();
      return;
    }
    this.navCtrl.push("BuyConfirmPage", {"item": i});
  }

  addItem() {
    this.navCtrl.push("AddInputPage")
  }

  sliceStr(str) {
    return str.slice(0, 20)+"..."
  }
}
