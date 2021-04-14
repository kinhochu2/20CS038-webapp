import { UserAccount } from './../../../config/UserAccount';
import { AuthService } from './../../../services/auth/AuthService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import sha256 from 'crypto-js/sha256';

type SignInResult = {
  email: string;
  uid: string;
  address: string;
  location: string;
}

@IonicPage()
@Component({
  selector: 'page-email-input',
  templateUrl: 'email-input.html'
})

export class EmailInputPage {

  protected email: string = '';
  protected password: string = '';
  protected location: string = '';
  protected errMsg : string = '';

  constructor(private navCtrl: NavController,
    private navParams: NavParams, private userAcc: UserAccount,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userAcc.resetAccount();
  }

  next() {
    this.signIn();
  }

  signIn() {
    if(this.checkInput()){
     let encodedPW = sha256(this.password);
     this.authService.signIn(this.email, encodedPW, this.location)
    .subscribe(
      (val) => {
          console.log("signIn call successful value returned in body", val);
          this.userAcc.setEmail(this.email);
          this.userAcc.setPassword(this.password);
          let retVal: SignInResult = JSON.parse(JSON.stringify(val));
          this.userAcc.setAddress(retVal.address);
          this.userAcc.setToLocation(retVal.location);
          this.navCtrl.setRoot("HomePage");
      },
      response => {
          console.log("signIn call in error", response);
      },
      () => {
          console.log("The signIn observable is now completed.");
      });
    }
  }

  checkInput() {
    if(this.password == '' || this.email == '' ) {
      this.errMsg = "Please enter valid email or password!";
      return false;
    }else if(this.location == '') {
      this.errMsg = "Please enter valid location!";
      return false;
    }else
      return true;
  }

}
