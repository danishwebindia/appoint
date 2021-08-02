import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Enquiry } from '../models/enquiry.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private API_URL= environment.API_URL;
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
    this.webAPIUrl = this.API_URL + '/api/Enquiry/';
    //this.webAPIUrl = 'https://dmsapi20210529232937.azurewebsites.net/api/Enquiry/';
  }

  saveEnquiry(requestDto: Enquiry): Observable<any> {
    console.log(requestDto);
    return this._httpClient.post<any>(this.webAPIUrl, JSON.stringify(requestDto), this.httpOptions);
  }

}
