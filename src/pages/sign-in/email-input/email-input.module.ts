import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailInputPage } from './email-input';

@NgModule({
  declarations: [
    EmailInputPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailInputPage),
  ],
})
export class EmailInputPageModule {}
