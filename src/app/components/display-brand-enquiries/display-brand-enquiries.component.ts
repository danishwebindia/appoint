import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DistributorService } from 'src/app/services/distributor.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-display-brand-enquiries',
  templateUrl: './display-brand-enquiries.component.html',
  styleUrls: ['./display-brand-enquiries.component.css']
})
export class DisplayBrandEnquiriesComponent implements OnInit {

  enquiries: any[];
  constructor(
    private _distributorService: DistributorService,
    private _spinnerService: NgxSpinnerService,
    private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this._spinnerService.show();
    this.displayEnquiryGrid();
  }

  openDialog(componentName, email, enquiryId): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '750px',
      data: [componentName, email, enquiryId],
    });

    dialogRef.afterClosed().subscribe(result => {
      this.displayEnquiryGrid();
      console.log('The dialog was closed 1234');
    });
  }

  replyToEnquiry(email: string, enquiryId: number): void{
    console.log(enquiryId);
    this.openDialog('replyToenquiry', email, enquiryId);
  }

  displayEnquiryGrid(): void{
    const user = JSON.parse(sessionStorage.getItem('user'));

    this._distributorService.getBrandIdByUserName(user.username).subscribe((brandId) => {
      this._distributorService.getBrandEnquiriesByBrandId(brandId).subscribe((result) => {
        this.enquiries = result;
        this._spinnerService.hide();
      });
    });
  }
}
