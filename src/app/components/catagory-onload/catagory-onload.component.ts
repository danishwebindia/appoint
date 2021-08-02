import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-catagory-onload',
  templateUrl: './catagory-onload.component.html',
  styleUrls: ['./catagory-onload.component.scss']
})
export class CatagoryOnloadComponent implements OnInit {

  @Input() catagoriesOnLoad: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
