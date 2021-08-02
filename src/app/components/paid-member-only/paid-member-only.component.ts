import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-paid-member-only',
  templateUrl: './paid-member-only.component.html',
  styleUrls: ['./paid-member-only.component.css']
})
export class PaidMemberOnlyComponent implements OnInit {

  @Output() closePopupEvent = new EventEmitter<any>();
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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

  openRequestCallBack(): void{
    this.openDialog('requestcallback');
    this.cancelRequest();
  }

  closePop(): any {
    return this.closePopupEvent.emit(null);
  }

  cancelRequest(): void {
    sessionStorage.removeItem('lead');
    this.closePop();
  }

}
