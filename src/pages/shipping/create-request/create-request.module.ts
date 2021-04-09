import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRequestPage } from './create-request';

@NgModule({
  declarations: [
    CreateRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRequestPage),
  ],
})
export class CreateRequestPageModule {}
