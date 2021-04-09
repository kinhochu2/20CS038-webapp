import { HttpProvider } from './../../providers/HttpProvider';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor(private httpProvider: HttpProvider) {
  }

  getCurrentUser() {
    return this.httpProvider.getRequest("auth/getcurrentuser");
  }

  getBalance(address: string) {
    let data = "address="+address;
    return this.httpProvider.postRequest("auth/getbalance", data);
  }

  signIn(email: string, password: string, location: string){
    let data= "email="+email+"&password="+password+"&location="+location;
    return this.httpProvider.postRequest("auth/signin", data);
  }

  signOut() {
    return this.httpProvider.postRequest("auth/signout", "");
  }


}
