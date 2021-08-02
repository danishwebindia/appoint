import { Component, OnInit } from '@angular/core';
import { DistributorService } from 'src/app/services/distributor.service';
import { GetbranddataService } from 'src/app/services/getbranddata.service';

@Component({
  selector: 'app-premium-brands',
  templateUrl: './premium-brands.component.html',
  styleUrls: ['./premium-brands.component.css']
})
export class PremiumBrandsComponent implements OnInit {

  private brandAssosiatedWithUs: any[] = [];
  public brandAssosiatedWithUsArrToDisplay: any[] = [];
  constructor(
    private distributorService: DistributorService,
    private getBrandData: GetbranddataService) { }

  ngOnInit(): void {
    this.distributorService.GetBrandsAssociatedWithUs().subscribe((result) => {
      if (result){
        result.forEach(element => {
          this.brandAssosiatedWithUs.push(element);
        });
      }

      while (this.brandAssosiatedWithUs.length > 0){
        this.brandAssosiatedWithUsArrToDisplay.push(this.brandAssosiatedWithUs.splice(0, 6));
      }
    });
  }

}
