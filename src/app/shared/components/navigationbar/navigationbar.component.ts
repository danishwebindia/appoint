import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.css']
})
export class NavigationbarComponent implements OnInit {

  user: any;
  constructor(
    public dialog: MatDialog,
    config: NgbCarouselConfig,
    private _router: Router) {
      config.interval = 5000;
      config.wrap = true;
      config.keyboard = false;
      config.pauseOnHover = true;
      config.showNavigationIndicators = false;
      if (sessionStorage.getItem('user')) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
      }
    }

  ngOnInit(): void {
    // setInterval(this.checkForLogin, 10000, 'my text');
    setInterval(() => this.checkForLogin(), 500);
  }

  openDialog(componentName): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: componentName !== 'login' ? '750px' : '550px',
      data: componentName,
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.user = result;
      // console.log('The dialog was closed');
    });
  }

  logout(): void{
    sessionStorage.removeItem('user');
    this.user = null;
    this._router.navigate(['/home']);
  }

  checkForLogin(): void {
    if (sessionStorage.getItem('user')) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
  }

  openEnquiries(): void{
    this._router.navigate(['/myenquiries']);
  }
}
