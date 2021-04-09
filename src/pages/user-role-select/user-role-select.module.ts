import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRoleSelectPage } from './user-role-select';

@NgModule({
  declarations: [
    UserRoleSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRoleSelectPage),
  ],
})
export class UserRoleSelectPageModule {}
