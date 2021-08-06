import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catagory-onload',
  templateUrl: './catagory-onload.component.html',
  styleUrls: ['./catagory-onload.component.scss']
})
export class CatagoryOnloadComponent implements OnInit {

  @Input() catagoriesOnLoad: any[] = [];

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  openAllRealtedBrands(catagoryId: number): void {
    if (catagoryId > 0) {
      this._router.navigate(['searchresultcategory', catagoryId]);
    }
  }

}
