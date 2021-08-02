import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetbranddataService } from 'src/app/services/getbranddata.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DistributorService } from 'src/app/services/distributor.service';

@Component({
  selector: 'app-know-more',
  templateUrl: './know-more.component.html',
  styleUrls: ['./know-more.component.scss']
})
export class KnowMoreComponent implements OnInit {

  public imagesArr: any[] = [];

  public BrandData: any;
  public BrandDataCollection: any;
  constructor(
    config: NgbCarouselConfig,
    private getBrandData: GetbranddataService,
    private _activatedRoute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private distributorService: DistributorService,
    public dialog: MatDialog) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
  }


  ngOnInit(): void {
    this.SpinnerService.show();
    this._activatedRoute.params.subscribe(parameter => {

      if (parameter.brandId) {
        this.distributorService.GetBrandDataForKnowMore(parameter.brandId).subscribe((result) => {
          if (result) {
            this.BrandData = result[0];
          }
          if (this.BrandData) {
            this.carouselImageAdjustment(this.BrandData.brandImages);
          }
        });
      }
      this.SpinnerService.hide();
    });
  }

  openDialog(componentName): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '750px',
      data: componentName,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  scroll(el: HTMLElement): void {
    // el.scrollTo({behavior: 'smooth', top: 20});
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  carouselImageAdjustment(imageData: any[]): void {
    while (imageData?.length > 0) {
      this.imagesArr.push(imageData.splice(0, 4));
    }
  }

}
