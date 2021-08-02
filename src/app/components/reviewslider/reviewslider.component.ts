import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reviewslider',
  templateUrl: './reviewslider.component.html',
  styleUrls: ['./reviewslider.component.css']
})
export class ReviewsliderComponent implements OnInit {

  constructor(config: NgbCarouselConfig) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {
  }

}
