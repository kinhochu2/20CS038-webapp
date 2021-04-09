import { IonDigitKeyboard } from './../../../components/ion-digit-keyboard/ion-digit-keyboard.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayInputPage } from './pay-input';
// import { SharedModule } from './../../../app/shared.module';


@NgModule({
  declarations: [
    PayInputPage,
  ],
  imports: [
    IonicPageModule.forChild(PayInputPage),
    IonDigitKeyboard
  ],
})
export class PayInputPageModule {}
