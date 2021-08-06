import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ApploadDataService } from '../../services/appload-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public catagoriesOnLoad: any[] = [];
  public catagories: any[] = [];
  public distributorLeads: any[] = [];
  sizeMessage: any[] = [];
  viewportSizes = [
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ];
  constructor(
     private location: Location,
     private apploadDataService: ApploadDataService,
     private SpinnerService: NgxSpinnerService,public breakpointObserver: BreakpointObserver, public mediaMatcher: MediaMatcher) {
    this.router = location.path();
    this.viewportSizes.forEach((s) => {
      this.sizeMessage.push(
        mediaMatcher.matchMedia(s)
      )
    });
  }

  router: string;
  ngOnInit(): void {
    // this.SpinnerService.show();
    this.apploadDataService.getApplicationLoadData().subscribe(result => {
      result.categories.forEach(element => {
        this.catagories.push(element);
      });
      this.breakpointObserver.observe([Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        if(state.breakpoints['(max-width: 599.98px)']==true){
          this.distributorLeads = this.chunk(result.distributorLeads.flat(), 1)
        } else if(state.breakpoints['(min-width: 600px) and (max-width: 959.98px)']==true){
          this.distributorLeads = this.chunk(result.distributorLeads.flat(), 2)

        } else {
          result.distributorLeads.forEach(element => {
            this.distributorLeads.push(element);
          });
        }
      })






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

  chunk(arr, size){
    let result = arr.reduce((rows, key, index) => (index % size == 0 ? rows.push([key]) : rows[rows.length-1].push(key)) && rows, []);
    return result;
}

}
