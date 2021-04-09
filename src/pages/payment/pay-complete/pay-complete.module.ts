import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayCompletePage } from './pay-complete';

@NgModule({
  declarations: [
    PayCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(PayCompletePage),
  ],
})
export class PayCompletePageModule {}
