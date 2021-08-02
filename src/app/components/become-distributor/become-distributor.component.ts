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
  selector: 'app-become-distributor',
  templateUrl: './become-distributor.component.html',
  styleUrls: ['./become-distributor.component.css']
})
export class BecomeDistributorComponent implements OnInit {

  becomeDistributorForm: FormGroup;

  locationMultiSelectSettings = {};
  businessNatureMultiSelectSettings = {};
  //products: MasterDataDto[] = [];
  businessNatures: MasterDataDto[] = [];
  categories: MasterDataDto[] = [];
  // distributorshipTypes: MasterDataDto[] = [];
  allLocations: LocationDto[] = [];
  countries: LocationDto[] = [];
  regions: LocationDto[] = [];
  selectedRegions: LocationDto[] = [];
  states: LocationDto[] = [];
  selectedStates: LocationDto[] = [];
  cities: LocationDto[] = [];
  selectedCities: LocationDto[] = [];

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    //brandName: '',
    businessNature: '',
    categories: '',
    investmentRequired: '',
    spaceRequired: '',
    pan: '',
    gstNumber: '',
    experianceType: '',
    //distributorshipType: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    // brandName: {
    //   required: 'Brand name is required.',
    //   startingWithEmptySpace: 'You cannot start with empty spaces.',
    // },
    businessNature: {
      required: 'Business nature is required.',
    },
    categories: {
      required: 'Category is required.',
    },
    investmentRequired: {
      required: 'Investment amount is required.',
      startingWithEmptySpace: 'You cannot start with empty spaces.',
    },
    spaceRequired: {
      required: 'Space is required.',
      startingWithEmptySpace: 'You cannot start with empty spaces.',
    },
    pan: {
      required: 'PAN is required.',
      minlength: 'PAN should have 10 characters.',
      maxlength: 'PAN should have 10 characters.',
      pattern: 'Enter a valid PAN.'
    },
    gstNumber: {
      required: 'GST number is required.',
      minlength: 'GST number should have 15 characters.',
      maxlength: 'GST number should have 15 characters.',
      pattern: 'Enter a valid GST number.'
    },
    experianceType: {
      required: 'Select experiance.',
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

    this.becomeDistributorForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.becomeDistributorForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
  }

  becomeDistributorSubmit(): void {
    this._spinnerService.show();
    //console.log(this.appointDistributorForm.value);
    let brandDto = this.mapFormValuesToModel();
    this._registrationService.registrationDto.brand = brandDto;
    this._registrationService.saveUserRegistrationDetails(this._registrationService.registrationDto).subscribe((result: any) => {
      this.handleSuccess(result);
    }, (error: any) => {
      this.handleError(error);
    });
  }

  setupForm() {

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

    this.becomeDistributorForm = this._formBuilder.group({
      // brandName: ['', [Validators.required, CustomValidators.startingWithEmptySpace()]],
      //brandName: ['', [CustomValidators.startingWithEmptySpace()]],
      // businessNature: ['', Validators.required],
      businessNatures: [[]],
      categories: [[]],
      products: [''],
      // investmentRequired: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      investmentRequired: ['', [CustomValidators.startingWithEmptySpace()]],
      spaceRequired: ['', [CustomValidators.startingWithEmptySpace()]],
      // pan: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]],
      pan: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]],
      // gstNumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15), Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      gstNumber: ['', [Validators.minLength(15), Validators.maxLength(15), Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      // experianceType: [[], Validators.required],
      experianceType: [],
      // distributorshipType: ['', Validators.required],
      countrywise: [false],
      regionwise: [false],
      regions: [this.selectedRegions],
      statewise: [false],
      states: [this.selectedStates],
      citywise: [false],
      cities: [this.selectedCities],
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

    // this._masterDataService.getAllDistributorshipTypes().subscribe((data: MasterDataDto[]) => {
    //   this.distributorshipTypes = data;
    // });

    this._masterDataService.getAllLocations().subscribe((data: LocationDto[]) => {
      this.allLocations = data;
    });
  }

  mapFormValuesToModel(): Brand {
    let brand = new Brand();

    //brand.name = this.becomeDistributorForm.value.brandName;
    brand.description = this.becomeDistributorForm.value.description;
    brand.categories = [parseInt(this.becomeDistributorForm.value.categories)];
    brand.businessNatures = this.becomeDistributorForm.value.businessNatures != "" ? this.becomeDistributorForm.value.businessNatures.map(({ id }) => id) : null;
    brand.investmentRequired = this.becomeDistributorForm.value.investmentRequired;
    brand.spaceRequired = this.becomeDistributorForm.value.spaceRequired;
    //brand.products = this.becomeDistributorForm.value.products != "" ? this.becomeDistributorForm.value.products.map(({ id }) => id) : null;
    brand.productsKeywords = this.becomeDistributorForm.value.products;
    brand.pan = this.becomeDistributorForm.value.pan;
    brand.gstNumber = this.becomeDistributorForm.value.gstNumber;
    brand.experianceType = this.becomeDistributorForm.value.experianceType;
    // brand.distributorshipType = this.becomeDistributorForm.value.distributorshipType;
    brand.requestType = RequestType.BecomeDistributor;
    //locations
    if (this.countries.length > 0) {
      brand.countrywiseLocations = this.countries.map(({ id }) => id);
    }
    if (this.selectedRegions.length > 0) {
      brand.regionwiseLocations = this.selectedRegions.map(({ id }) => id);
    }
    if (this.selectedStates.length > 0) {
      brand.statewiseLocations = this.selectedStates.map(({ id }) => id);
    }
    if (this.selectedCities.length > 0) {
      brand.citywiseLocations = this.selectedCities.map(({ id }) => id);
    }

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
    this.becomeDistributorForm.reset();
    // alert('request callback submitted');
    this._toastr.success('Your data has been saved successfully.', 'Success');
    //this._router.navigate(['home']);
  }

  logValidationErrors(group: FormGroup = this.becomeDistributorForm): void {
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

  public onCountryChecked(event) {
    if (event.target.checked) {
      this.countries = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
    }
    else {
      this.countries = [];
    }
  }

  public onRegionChecked(event) {
    if (event.target.checked) {
      this.regions = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
    }
    else {
      this.regions = [];
      this.selectedRegions = [];
    }
  }

  public onStateChecked(event) {
    if (event.target.checked) {
      this.states = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
    }
    else {
      this.states = [];
      this.selectedStates = [];
    }
  }

  public onCityChecked(event) {
    if (event.target.checked) {
      this.cities = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
    }
    else {
      this.cities = [];
      this.selectedCities = [];
    }
  }

}
