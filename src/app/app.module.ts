import { Geofence } from '@ionic-native/geofence/ngx';
import { Geolocation } from '@ionic-native/geolocation';
import { UserAccount } from './../config/UserAccount';
import { MarketService } from './../services/market/MarketService';
import { LocationTrackingService } from './../services/Location-tracking/LocationTrackingService';
import { AuthService } from './../services/auth/AuthService';
import { HttpProvider } from '../providers/HttpProvider';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { HttpClientModule } from '@angular/common/http';
import { ProofService } from '../services/proof/ProofService';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    // SharedModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Clipboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpProvider,
    AuthService,
    LocationTrackingService,
    MarketService,
    ProofService,
    UserAccount,
    Geolocation,
    Geofence
  ],
})
export class AppModule {}
