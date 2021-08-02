import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { DistributorService } from 'src/app/services/distributor.service';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-searchbar-distributor-leads',
  templateUrl: './searchbar-distributor-leads.component.html',
  styleUrls: ['./searchbar-distributor-leads.component.scss']
})
export class SearchbarDistributorLeadsComponent implements OnInit {

  public catagories: any[] = [];
  public states: any[] = [];
  public cities: any[] = [];

  public selectedState = 0;
  public selectedcity = 0;
  public selectedCatagory = 0;
  public searchText = '';
  public selectedCatagoryName: string;

  public resultDistributorLeads: any[];

  @Output() toggleSearchBar: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private masterDataService: MasterDataService,
    private distributorService: DistributorService,
    private SpinnerService: NgxSpinnerService) { }

  public result = false;

  ngOnInit(): void {

    if (sessionStorage.getItem('catagories')) {
      const prodCatagories =  JSON.parse(sessionStorage.getItem('catagories'));
      prodCatagories.forEach(element => {
        element.forEach(item => {
          this.catagories.push(item);
        });
      });
    }

    this.SpinnerService.show();
    forkJoin(
      {
        catagories: this.masterDataService.getAllCategories(),
        states: this.masterDataService.getAllStates(),
        cities: this.masterDataService.getAllCities()
      }
    ).subscribe((result) => {
      this.SpinnerService.hide();

      result.catagories.forEach(element => {
        element.forEach(item => {
          if (!sessionStorage.getItem('catagories')){
            this.catagories.push(item);
          }
        });
      });

      result.states.forEach(item => {
        this.states.push(item);
      });

      result.cities.forEach(item => {
        this.cities.push(item);
      });
    });
  }


  searchDistributorsLeads(): void {
    const BrandFilterDto = { categoryId: +this.selectedCatagory, searchKeyword: this.searchText, stateId: +this.selectedState, cityId: +this.selectedcity, requestType: 1 };
    this.distributorService.getDistributorsLeadsBySearchFilter(BrandFilterDto).subscribe((response) => {
      if (response) {
        this.resultDistributorLeads = response;
        if (this.catagories.find(x => x.id == this.selectedCatagory)) {
          this.selectedCatagoryName = this.catagories.find(x => x.id == this.selectedCatagory).name;
        }
      }
    });
    this.result = true;
  }

  onKeyDownEvent(event: any): void {
    this.router.navigate(['/distributorleadsresult'], { relativeTo: this.route });
  }

  onSearchClickClickEvent(): void {
    return this.toggleSearchBar.emit('distributorleadsresult');
  }

}
