import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponseListPage } from './response-list';

@NgModule({
  declarations: [
    ResponseListPage,
  ],
  imports: [
    IonicPageModule.forChild(ResponseListPage),
  ],
})
export class ResponseListPageModule {}
