import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { Enquiry } from 'src/app/models/enquiry.model';
import {InquiryType} from 'src/app/models/system.enums';
import { CustomValidators } from 'src/app/shared/custom.validators';

@Component({
  selector: 'app-ask-experts',
  templateUrl: './ask-experts.component.html',
  styleUrls: ['./ask-experts.component.css']
})
export class AskExpertsComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
    private _enquiryService: EnquiryService,
    private _spinnerService: NgxSpinnerService,
    private _toastr: ToastrService) { }

  askExpertsForm: FormGroup;

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    name: '',
    mobileNumber: '',
    description: '',
    isAgreed: '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    name: {
      required: 'Name is required.',
      startingWithEmptySpace: 'You cannot start name with empty spaces.',
      minlength: 'Name should have at least 2 characters.'
    },
    mobileNumber: {
      required: 'Mobile number is required.',
      minlength: 'Mobile number should have 10 characters.',
      maxlength: 'Mobile number should have 10 characters.',
      pattern: 'Only numbers are allowed.'
    },
    description: {
      required: 'Description is required.',
      startingWithEmptySpace: 'You cannot start description with empty spaces.',
      maxlength: 'Description should not exceed more than 1000 characters.'
    },
    isAgreed: {
      requiredTrue: 'Please accept the agreement before submitting your requirements.',
    },

  };

  ngOnInit(): void {
    this.askExpertsForm = this._formBuilder.group({
      name: ['', [Validators.required, CustomValidators.startingWithEmptySpace(), Validators.minLength(2)]],
      mobileNumber: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      description: ['', [Validators.required,
      CustomValidators.startingWithEmptySpace(),
      Validators.maxLength(2000)]],
      isAgreed: ['', Validators.requiredTrue],
    });

    this.askExpertsForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.askExpertsForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
  }

  askExperts(): void {
    this._spinnerService.show();
    let requirement = this.mapFormValuesToRquirementModel();
    this._enquiryService.saveEnquiry(requirement).subscribe((result: any) => {
      this.handleSuccess(result);
    }, (error: any) => {
      this.handleError(error);
    });
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
    this.askExpertsForm.reset();
    // alert('request callback submitted');
    this._toastr.success('Thanks for you interest, you query has been haved. We will connect with you soon.', 'Success');
  }

  mapFormValuesToRquirementModel(): Enquiry {
    let requirement = new Enquiry();
    requirement.InquiryType = InquiryType.AskExperts;
    requirement.name = this.askExpertsForm.value.name;
    requirement.mobileNumber = this.askExpertsForm.value.mobileNumber;
    requirement.description = this.askExpertsForm.value.description;

    return requirement;
  }

  logValidationErrors(group: FormGroup = this.askExpertsForm): void {
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

}
