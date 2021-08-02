import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { RegistrationDto } from 'src/app/models/registration.model';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  distributorshipType: string;
  registrationDto: RegistrationDto;

  constructor(private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
    private _toastr: ToastrService,
    private _registrationService: RegistrationService) { 
      this.registrationDto = this._registrationService.registrationDto;
    }

  registrationForm: FormGroup;
  formCompanyDtails: FormGroup;
  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    name: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordGroup: '',
    companyName: '',
    address: '',
    postalCode: '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    name: {
      required: 'Name is required.',
      startingWithEmptySpace: 'You cannot start name with empty spaces.',
      minlength: 'Name should at least have 2 characters.',
      maxlength: 'Name cannot have more than 50 characters.',
    },
    mobileNumber: {
      required: 'Mobile number is required.',
      minlength: 'Mobile number should have 10 characters.',
      maxlength: 'Mobile number should have 10 characters.',
      pattern: 'Only numbers are allowed.'
    },
    email: {
      required: 'Email is required.',
      startingWithEmptySpace: 'You cannot start description with empty spaces.',
      pattern: 'Please provide valid email address.'
    },
    password: {
      required: 'Password is required.',
      startingWithEmptySpace: 'You cannot start password text with empty spaces.',
      minlength: 'Password should have at least 4 characters.',
      maxlength: 'Password should not exceed more than 8 characters.'
    },
    confirmPassword: {
      required: 'Confirm password is required.',
      mustMatch: 'Password and confirm password must be same.'
    },
    companyName: {
      required: 'Company name is required.',
      startingWithEmptySpace: 'You cannot start company name with empty spaces.',
    },
    address: {
      required: 'Address is required.',
      startingWithEmptySpace: 'You cannot start address with empty spaces.',
    },
    postalCode: {
      minlength: 'Postal code must have 6 digits.',
      maxlength: 'Postal code must have 6 digits.',
      pattern: 'Only numbers are allowed.'
    },
  };

  ngOnInit(): void {
    this.registrationForm = this._formBuilder.group({
      name: [this.registrationDto.name, [Validators.required,
      CustomValidators.startingWithEmptySpace(),
      Validators.minLength(2),
      Validators.maxLength(50)]],
      mobileNumber: [this.registrationDto.mobileNumber, [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      email: [this.registrationDto.email, [Validators.required,
      CustomValidators.startingWithEmptySpace(),
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: [this.registrationDto.password, [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10), 
      CustomValidators.startingWithEmptySpace()]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validator: CustomValidators.MustMatch('password', 'confirmPassword')
  });

    this.formCompanyDtails = this._formBuilder.group({
      companyName: [this.registrationDto.companyName, [Validators.required, CustomValidators.startingWithEmptySpace()]],
      website: [this.registrationDto.website],
      address: [this.registrationDto.address, [Validators.required, CustomValidators.startingWithEmptySpace()]],
      postalCode: [this.registrationDto.postalCode, [Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });

    this.registrationForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.registrationForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
  }

  logValidationErrors(group: FormGroup = this.registrationForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty)) {
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

  matchPasswords(group: AbstractControl): { [key: string]: any } | null {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
      return null;
    } else {
      return { 'passwordMismatch': true };
    }
  }

  saveUserDetails() {
    this.registrationDto.name = this.registrationForm.value.name;
    this.registrationDto.mobileNumber = this.registrationForm.value.mobileNumber;
    this.registrationDto.email = this.registrationForm.value.email;
    this.registrationDto.password = this.registrationForm.value.password;
    
  }

  saveCompanyDetails() {
    this.registrationDto.companyName = this.formCompanyDtails.value.companyName;
    this.registrationDto.website = this.formCompanyDtails.value.website;
    this.registrationDto.address = this.formCompanyDtails.value.address;
    this.registrationDto.postalCode = this.formCompanyDtails.value.postalCode;
    
  }

  ondistributorshipTypeChanged(event){
    this.distributorshipType= event.target.value;
  }

}
