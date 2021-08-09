import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToggleAllCatagoriesService } from 'src/app/services/toggle-all-catagories.service';

@Component({
  selector: 'app-catagory-onload',
  templateUrl: './catagory-onload.component.html',
  styleUrls: ['./catagory-onload.component.scss'],
  providers: [NgbCarouselConfig]
})
export class CatagoryOnloadComponent implements OnInit {

  @Input() catagoriesOnLoad: any[] = [];
  public displayAll = false;
  public message = '';

  constructor(private _router: Router,
    private toggleAllCatagoriesService: ToggleAllCatagoriesService,
    config: NgbCarouselConfig) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = true;
    }

  ngOnInit(): void {
    this.toggleAllCatagoriesService.currentApprovalStageMessage.subscribe(msg => this.displayAll = msg);
  }

  openAllRealtedBrands(catagoryId: number): void {
    if (catagoryId > 0) {
      this._router.navigate(['knowmore', catagoryId]);
    }
  }

  toggleDisplayAll(): void {
    this.displayAll = !this.displayAll;
    this.toggleAllCatagoriesService.updateDisplayAllCatagoriesFlag(this.displayAll);
  }

}
