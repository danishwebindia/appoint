import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DistributorService } from 'src/app/services/distributor.service';
import { GetbranddataService } from 'src/app/services/getbranddata.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-search-result-category',
  templateUrl: './search-result-category.component.html',
  styleUrls: ['./search-result-category.component.scss']
})
export class SearchResultCategoryComponent implements OnInit {

  public collection: any[] = [];
  constructor(
    config: NgbCarouselConfig,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private distributorService: DistributorService,
    private _activatedRoute: ActivatedRoute,
    private getBrandData: GetbranddataService,
    public dialog: MatDialog) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
  }

  ngOnInit(): void {
    this.SpinnerService.show();
    this._activatedRoute.params.subscribe(parameter => {

      if (parameter.id && parameter.key) {
        this.distributorService.getBrandsByCategoryAndProductsKeyword(parameter.id, parameter.key).subscribe((result) => {
          this.collection = result;
          this.getBrandData.setOption('BrandDataByCatagory', result);
        });
      } else {
        this.distributorService.GetBrandsByCategoryId(parameter.id).subscribe((result) => {
          this.collection = result;
          this.getBrandData.setOption('BrandDataByCatagory', result);
        });
      }

      this.SpinnerService.hide();
    });
  }

  openKnowMore(id: number): void {
    this.router.navigate(['./knowmore', id]);
  }

  openDialog(componentName, brandId): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '750px',
      data: [componentName, brandId],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
