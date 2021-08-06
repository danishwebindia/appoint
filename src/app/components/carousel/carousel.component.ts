import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DistributorService } from 'src/app/services/distributor.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  @Input() distributorLeads: any[] = [];
  showNavigationArrows = false;
  constructor(
    config: NgbCarouselConfig,
    public dialog: MatDialog,
    private distributorService: DistributorService,
    public breakpointObserver: BreakpointObserver,
    public mediaMatcher: MediaMatcher) {
    config.interval = 50000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {


    this.breakpointObserver.observe([Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge])
    .subscribe((state: BreakpointState) => {
      if(state.breakpoints['(max-width: 599.98px)']==true){
        this.showNavigationArrows = true;
      } else if(state.breakpoints['(min-width: 600px) and (max-width: 959.98px)']==true){
        this.showNavigationArrows = true;

      } else {

        this.showNavigationArrows = false;
      }
    })
  }

  openDialog(componentName): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: componentName !== 'login' ? '750px' : '550px',
      data: componentName,
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
    });
  }


  openDistibutorsLeadData(id: number): void {
    if (!sessionStorage.getItem('user')) {
      this.openDialog('login');
    } else {
      const distributorLeadsArr = [];
      this.distributorLeads.forEach(element => {
        element.forEach(item => {
          distributorLeadsArr.push(item);
        });

      });

      const lead = distributorLeadsArr.find(d => d.id === id);
      const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

      this.distributorService.getBrandSubscribedCategoriesByBrandId(loggedInUser.brandId).subscribe((result) => {
        if (result){
          if (lead?.mainCategoryId > 0 && result.includes(lead?.mainCategoryId)) {
            sessionStorage.setItem('lead', JSON.stringify(lead));
            this.openDialog('distributorLeadsData');
          }else{
            this.openDialog('paidonly');
          }
        }
      });
    }
  }
}
