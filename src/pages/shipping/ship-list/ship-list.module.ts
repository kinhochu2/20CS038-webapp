import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShipListPage } from './ship-list';

@NgModule({
  declarations: [
    ShipListPage,
  ],
  imports: [
    IonicPageModule.forChild(ShipListPage),
  ],
})
export class ShipListPageModule {}
