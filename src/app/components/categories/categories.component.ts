import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToggleAllCatagoriesService } from 'src/app/services/toggle-all-catagories.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input() catagories: any[] = [];

  public displayAll = false;

  public imagePath: SafeResourceUrl;
  constructor(private _sanitizer: DomSanitizer, private toggleAllCatagoriesService: ToggleAllCatagoriesService) {

    this.imagePath = ''; // this._sanitizer.bypassSecurityTrustResourceUrl(this.catagories[0][0].image);
  }


  ngOnInit(): void {
    if (sessionStorage.getItem('catagories')) {
      this.catagories = JSON.parse(sessionStorage.getItem('catagories'));
    }
    this.toggleAllCatagoriesService.currentApprovalStageMessage.subscribe(msg => this.displayAll = msg);
  }

  get data(): boolean{
    // console.log(this.toggleAllCatagoriesService.displayAll);
    return this.toggleAllCatagoriesService.displayAll;
  }


  toggleDisplayAll(): void {
    this.displayAll = !this.displayAll;
    this.toggleAllCatagoriesService.updateDisplayAllCatagoriesFlag(this.displayAll);
  }

}
