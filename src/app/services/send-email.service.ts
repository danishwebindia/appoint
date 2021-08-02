import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email } from '../models/email.model';

@Injectable()
export class SendEmailService {

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
    this.webAPIUrl = this.API_URL + '/api/Mail/';
  }

  sendEmail(emailDto: Email): Observable<any> {
    return this._httpClient.post<any>(this.webAPIUrl + 'send/', emailDto, this.httpOptions);
  }
}
