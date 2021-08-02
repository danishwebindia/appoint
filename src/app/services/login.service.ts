import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BusinessProfile } from '../models/businessProfile.model';
import { Login } from '../models/login.model';

@Injectable()
export class LoginService  {

  private API_URL = environment.API_URL;
  webAPIUrl: string;
  private httpOptions = {
    headers: new HttpHeaders(
      {
        // Authorization: 'Bearer ' + this.token ,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
  };

  constructor(private _httpClient: HttpClient) {
    this.webAPIUrl = this.API_URL + '/api/Login/';
  }

  login(loginDto: Login): Observable<any> {
    return this._httpClient.post<any>(this.webAPIUrl, JSON.stringify(loginDto), this.httpOptions);
  }

  public getUserBusinessProfile(userId: number): Observable<BusinessProfile> {
    return this._httpClient.get<BusinessProfile>(this.webAPIUrl + 'GetUserBusinessProfile?userId=' + userId);
  }

}
