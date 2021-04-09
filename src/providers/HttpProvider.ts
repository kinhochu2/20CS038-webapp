import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { localServer, OpenMapQuestApi} from './../providers/HttpURL';
import 'rxjs/add/operator/map';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token',
    'Accept': '*/*',
  })
};

@Injectable()
export class HttpProvider {

  constructor(private http: HttpClient) {

  }

  getRequest(url) {
    return this.http.get(localServer+url);
  }

  postRequest(url, dataToPost) {
    httpOptions.headers = httpOptions.headers.set('Authorization', 'my-new-auth-token');
    httpOptions.headers.set('Content-type', 'application/x-www-form-urlencoded');
    return this.http.post(localServer+url, dataToPost, httpOptions);
  }

  getMapQuestOpenAPI(url) {
    return this.http.get(OpenMapQuestApi+url);
  }
}

