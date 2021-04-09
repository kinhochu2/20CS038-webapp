import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyConfirmPage } from './buy-confirm';

@NgModule({
  declarations: [
    BuyConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(BuyConfirmPage),
  ],
})
export class BuyConfirmPageModule {}
