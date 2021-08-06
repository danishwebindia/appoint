import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApploadDataService {

  private API_URL = environment.API_URL;
  webAPIUrl: string;
  // private token = localStorage.getItem('jwt');
  private httpOptions = {
    headers: new HttpHeaders(
      {
        // Authorization: 'Bearer ' + this.token ,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
  };

  constructor(private _httpClient: HttpClient) {
    // this.webAPIUrl = 'http://localhost:51276/api/Home/GetApplicationLoadData/';
    this.webAPIUrl = this.API_URL + '/api/Home/GetApplicationLoadData/';
  }

  public getApplicationLoadData(): Observable<any>{
    return this._httpClient.get<any>(this.webAPIUrl);
  }
}
