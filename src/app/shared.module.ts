import { IonDigitKeyboardCmp } from './../components/ion-digit-keyboard/components';
import { NgModule } from '@angular/core';
// import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
  ],
  declarations: [
    IonDigitKeyboardCmp,
  ],
  exports: [
    IonDigitKeyboardCmp,
    // NgxQRCodeModule
  ],
})

export class SharedModule { }
