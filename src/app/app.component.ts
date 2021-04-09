import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'EmailInputPage';

  pages: Array<{title: string, component: any}>;

  menuItems: Array<{title: string, icon: string, pageId: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    this.menuItems = [
      {title: "Home", icon: "home", pageId: "HomePage"},
      {title: "Logout", icon: "log-out", pageId: "EmailInputPage"}
    ]

    // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Home', component: WelcomePage },
    //   { title: 'List', component: ListPage }
    // ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page);
  }

  logout(){
    this.openPage('EmailInputPage');
  }
}
