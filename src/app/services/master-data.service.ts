import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private API_URL = environment.API_URL;
  webAPIUrl: string;

  constructor(private _httpClient: HttpClient) {
    this.webAPIUrl = this.API_URL + '/api/MasterData/';
    // this.webAPIUrl = 'https://dmsapi20210529232937.azurewebsites.net/api/MasterData/';
  }

  public getAllCategories(): Observable<any[]> {
    return this._httpClient.get<any[]>(this.webAPIUrl + 'GetAllCategories/');
  }

  public getAllCategoriesMasterData(): Observable<any[]> {
    return this._httpClient.get<any[]>(this.webAPIUrl + 'getAllCategoriesMasterData/');
  }

  public getAllBusinessNatures() {
    return this._httpClient.get(this.webAPIUrl + 'GetAllBusinessNatures/');
  }

  public getAllDistributorshipTypes() {
    return this._httpClient.get(this.webAPIUrl + 'GetAllDistributorshipTypes/');
  }

  public getProducts() {
    return this._httpClient.get(this.webAPIUrl + 'GetAllProducts/');
  }

  public getAllLocations() {
    return this._httpClient.get(this.webAPIUrl + 'GetAllLocations/');
  }

  public getAllStates(): Observable<any[]> {
    return this._httpClient.get<any[]>(this.webAPIUrl + 'GetAllStates/');
  }

  public getAllCities(): Observable<any[]> {
    return this._httpClient.get<any[]>(this.webAPIUrl + 'GetAllCities/');
  }
}
