import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShipLocationPage } from './ship-location';

@NgModule({
  declarations: [
    ShipLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(ShipLocationPage),
  ],
})
export class ShipLocationPageModule {}
