import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ApploadDataService } from '../../services/appload-data.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public catagoriesOnLoad: any[] = [];
  public catagories: any[] = [];
  public distributorLeads: any[] = [];
  constructor(
     private location: Location,
     private apploadDataService: ApploadDataService,
     private SpinnerService: NgxSpinnerService) {
    this.router = location.path();
  }

  router: string;
  ngOnInit(): void {
    // this.SpinnerService.show();
    this.apploadDataService.getApplicationLoadData().subscribe(result => {      
      result.categories.forEach(element => {
        this.catagories.push(element);
      });

      result.distributorLeads.forEach(element => {
        this.distributorLeads.push(element);
      });

      for (const catagory  of result.categories[0]){
        this.catagoriesOnLoad.push(catagory);
      }
      for (const catagory  of result.categories[1].slice(0, 3)){
        this.catagoriesOnLoad.push(catagory);
      }

      sessionStorage.setItem('catagories', JSON.stringify(this.catagories));

      this.SpinnerService.hide();
    });
  }

}
