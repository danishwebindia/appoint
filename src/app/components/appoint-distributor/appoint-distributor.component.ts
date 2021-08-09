import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { DistributorService } from 'src/app/services/distributor.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Brand } from 'src/app/models/brand.model';
import { MasterDataDto } from 'src/app/models/master-data.model';
import { LocationDto } from 'src/app/models/location.model';
import { RequestType } from 'src/app/models/system.enums';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-appoint-distributor',
  templateUrl: './appoint-distributor.component.html',
  styleUrls: ['./appoint-distributor.component.css']
})
export class AppointDistributorComponent implements OnInit {

  appointDistributorForm: FormGroup;
  brandLogoUrl: string = '';
  locationMultiSelectSettings = {};
  //categoriesSettings = {};
  businessNatureMultiSelectSettings = {};
  categories: MasterDataDto[] = [];
  businessNatures: MasterDataDto[] = [];
  //distributorshipTypes: MasterDataDto[] = [];
  allLocations: LocationDto[] = [];
  regions: LocationDto[] = [];
  selectedRegions: LocationDto[] = [];
  states: LocationDto[] = [];
  selectedStates: LocationDto[] = [];
  cities: LocationDto[] = [];
  selectedCities: LocationDto[] = [];
  productsImages: string[] = [];


  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    brandName: '',
    businessNature: '',
    minInvestmentAmount: '',
    maxInvestmentAmount: '',
    establishmentYear: '',
    spaceRequired: '',
    categories: '',
    totalEmployees: '',
    annualSales: '',
    productsKeywords: '',
    //distributorshipType: '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    brandName: {
      required: 'Brand name is required.',
      startingWithEmptySpace: 'You cannot start with empty spaces.',
    },
    businessNature: {
      required: 'Business nature is required.',
    },
    minInvestmentAmount: {
      required: 'Please provide minimum investment amount.',
      pattern: 'Only numbers are allowed.'
    },
    maxInvestmentAmount: {
      required: 'Please provide maximum investment amount.',
      pattern: 'Only numbers are allowed.'
    },
    establishmentYear: {
      required: 'Establishment year is required.',
      minlength: 'Establishment year should have 4 digits.',
      maxlength: 'Establishment year should have 4 digits.',
      min: 'Year cannot be less than 1900',
      max: 'Year cannot be greater than 2050'
    },
    spaceRequired: {
      required: 'Space is required.',
      startingWithEmptySpace: 'You cannot start with empty spaces.',
    },
    categories: {
      required: 'Category is required.',
    },
    totalEmployees: {
      required: 'Please enter total number of employees.',
      pattern: 'Only numbers are allowed.'
    },
    annualSales: {
      required: 'Please provide annual sales figures.',
      pattern: 'Only numbers are allowed.'
    },
    productsKeywords: {
      required: 'Products keywords are required',
      startingWithEmptySpace: 'You cannot start with empty spaces.',
    },
    distributorshipType: {
      required: 'Distributorship type is required.',
    },

  };

  constructor(private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _toastr: ToastrService,
    private _distributorService: DistributorService,
    private _masterDataService: MasterDataService,
    private _registrationService: RegistrationService) { }

  ngOnInit(): void {

    this.loadMasterData();

    this.setupForm();

    this.appointDistributorForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.appointDistributorForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
  }

  appointDistributorSubmit(): void {
    this._spinnerService.show();
    // console.log(this.appointDistributorForm.value);
    let brandDto = this.mapFormValuesToModel();

    this._registrationService.registrationDto.brand = brandDto;

    this._registrationService.saveUserRegistrationDetails(this._registrationService.registrationDto).subscribe((result: any) => {
      this.handleSuccess(result);
    }, (error: any) => {
      this.handleError(error);
    });
  }

  setupForm() {
    // this.categoriesSettings = {
    //   singleSelection: false,
    //   idField: 'id',
    //   textField: 'name',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 6,
    //   allowSearchFilter: true
    // };

    this.locationMultiSelectSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    this.businessNatureMultiSelectSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.appointDistributorForm = this._formBuilder.group({
      brandName: ['', [CustomValidators.startingWithEmptySpace()]],
      businessNatures: [[]],
      minInvestmentAmount: ['', [Validators.pattern(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/)]],
      maxInvestmentAmount: ['', [Validators.pattern(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/)]],
      establishmentYear: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.min(1900), Validators.max(2050)]],
      spaceRequired: ['', [CustomValidators.startingWithEmptySpace()]],
      categories: [[]],
      totalEmployees: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      annualSales: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      productsKeywords: ['', [CustomValidators.startingWithEmptySpace()]],
      //distributorshipType: ['', Validators.required],
      countrywise: [false],
      regionwise: [false],
      regions: [this.selectedRegions],
      statewise: [false],
      states: [this.selectedStates],
      citywise: [false],
      cities: [this.selectedCities],
      brandLogo: [''],
      productsImages: [[]],
      description: [''],
    });

  }

  loadMasterData() {
    this._masterDataService.getAllCategoriesMasterData().subscribe((data: MasterDataDto[]) => {
      this.categories = data;
    });

    this._masterDataService.getAllBusinessNatures().subscribe((data: MasterDataDto[]) => {
      this.businessNatures = data;
    });

    // this._masterDataService.getAllDistributorshipTypes().subscribe((data: MasterDataDto[])=>{
    //   this.distributorshipTypes = data;
    // });

    this._masterDataService.getAllLocations().subscribe((data: LocationDto[]) => {
      this.allLocations = data;
    });

  }

  mapFormValuesToModel(): Brand {
    let brand = new Brand();

    brand.name = this.appointDistributorForm.value.brandName;
    brand.description = this.appointDistributorForm.value.description;
    brand.businessNatures = this.appointDistributorForm.value.businessNatures != "" ? this.appointDistributorForm.value.businessNatures.map(({ id }) => id) : null;
    brand.minInvestmentAmount = this.appointDistributorForm.value.minInvestmentAmount;
    brand.maxInvestmentAmount = this.appointDistributorForm.value.maxInvestmentAmount;
    brand.establishmentYear = this.appointDistributorForm.value.establishmentYear;
    brand.spaceRequired = this.appointDistributorForm.value.spaceRequired;
    brand.categories = [parseInt(this.appointDistributorForm.value.categories)];
    brand.totalEmployees = this.appointDistributorForm.value.totalEmployees;
    brand.annualSales = this.appointDistributorForm.value.annualSales;
    brand.productsKeywords = this.appointDistributorForm.value.productsKeywords;
    //brand.distributorshipType = this.appointDistributorForm.value.distributorshipType;
    brand.requestType = RequestType.AppointDistributor;
    brand.brandLogo = this.brandLogoUrl;
    brand.brandImages = this.productsImages;

    return brand;
  }

  handleError(error: any): void {
    // if (error.statusText === 'Bad Request' || error.status === 400) {
    //   alert(error.error);
    //   this._spinnerService.hide();
    // }
    console.log(error);
    this._toastr.error('Oops something went wrong !!! Please try again after sometime', 'Error');
    this._spinnerService.hide();
  }

  handleSuccess(resp: any): void {
    this._spinnerService.hide();
    this._registrationService.registrationDto = null;
    this.appointDistributorForm.reset();
    // alert('request callback submitted');
    this._toastr.success('Your data has been saved successfully.', 'Success');
    //this._router.navigate(['home']);
  }

  logValidationErrors(group: FormGroup = this.appointDistributorForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (key == 'categories' || abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  onRegionChecked(event) {
    if (event.target.checked) {
      this.regions = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
    }
    else {
      this.regions = [];
      this.selectedRegions = [];
    }
  }

  onStateChecked(event) {
    if (event.target.checked) {
      this.states = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
    }
    else {
      this.states = [];
      this.selectedStates = [];
    }
  }

  onCityChecked(event) {
    if (event.target.checked) {
      this.cities = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
    }
    else {
      this.cities = [];
      this.selectedCities = [];
    }
  }

  onLogoSelected(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.brandLogoUrl = event.target.result;
      }
    }
  }

  onProductsImagesSelected(e) {
    if (e.target.files && e.target.files[0]) {
      var totalFilesUploaded = e.target.files.length + this.productsImages.length;
      if(totalFilesUploaded > 10){
        this._toastr.error('You can upload a maximum of 10 images', 'Error');
      }
      else{
        for (let i = 0; i < e.target.files.length; i++) {
          var reader = new FileReader();
          reader.readAsDataURL(e.target.files[i]);
          reader.onload = (event: any) => {
            this.productsImages.push(event.target.result);

            this.appointDistributorForm.patchValue({
              productsImages: this.productsImages
            });
          }
        }
      }

    }
  }

  onDeleteProductImage(event) {
    console.log(event.target.value);
    const index = this.productsImages.indexOf(event.target.value, 0);
    if (index > -1) {
      this.productsImages.splice(index, 1);
    }
  }

}
