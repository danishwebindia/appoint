import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Enquiry } from 'src/app/models/enquiry.model';
import { InquiryType } from 'src/app/models/system.enums';
import { EnquiryService } from 'src/app/services/enquiry.service';
import { CustomValidators } from 'src/app/shared/custom.validators';

@Component({
  selector: 'app-send-enquiry',
  templateUrl: './send-enquiry.component.html',
  styleUrls: ['./send-enquiry.component.css']
})
export class SendEnquiryComponent implements OnInit {

  @Input() brandId: number;
  @Output() closePopupEvent = new EventEmitter<any>();

  sendEnquiryForm: FormGroup;

  formErrors = {
    subject: '',
    mobileNumber: '',
    email: '',
    location: '',
    requirement: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    subject: {
      required: 'Subject is required.',
    },
    mobileNumber: {
      required: 'Mobile number is required.',
      minlength: 'Mobile number should have 10 characters.',
      maxlength: 'Mobile number should have 10 characters.',
      pattern: 'Only numbers are allowed.'
    },
    email: {
      required: 'Email is required.',
      startingWithEmptySpace: 'You cannot start email with empty spaces.',
      pattern: 'Please provide valid email address.'
    },
    location: {
      required: 'Location is required.',
      startingWithEmptySpace: 'You cannot start location with empty spaces.',
      maxlength: 'Location should not exceed more than 100 characters.'
    },
    description: {
      required: 'Description is required.',
      startingWithEmptySpace: 'You cannot start description with empty spaces.',
      maxlength: 'Description should not exceed more than 1000 characters.'
    },
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _spinnerService: NgxSpinnerService,
    private _enquiryService: EnquiryService) { }

  ngOnInit(): void {
    this.sendEnquiryForm = this._formBuilder.group({
      subject: ['', Validators.required],
      mobileNumber: ['', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      email: ['', [Validators.required,
        CustomValidators.startingWithEmptySpace(),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      location: ['', [Validators.required, CustomValidators.startingWithEmptySpace()]],
      requirement: ['', [Validators.required,
        CustomValidators.startingWithEmptySpace(),
        Validators.maxLength(2000)]]
    });

    this.sendEnquiryForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.sendEnquiryForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
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
    this.sendEnquiryForm.reset();
    // alert('request callback submitted');
    this._toastr.success('Your requirements are saved successfully. We will contact you soon.', 'Success');
    this.closePop();
    // this._router.navigate(['home']);
  }

  closePop(): any {
    return this.closePopupEvent.emit(null);
  }

  cancelRequest(): void {
    sessionStorage.removeItem('lead');
    this.closePop();
  }

  logValidationErrors(group: FormGroup = this.sendEnquiryForm): void {
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

  mapFormValuesToRquirementModel(): Enquiry {
    const enquiry = new Enquiry();
    enquiry.InquiryType = InquiryType.BrandInquiry;
    enquiry.requestType = 0;
    enquiry.brandId = this.brandId;
    enquiry.subject = this.sendEnquiryForm.value.subject;
    enquiry.mobileNumber = this.sendEnquiryForm.value.mobileNumber;
    enquiry.email = this.sendEnquiryForm.value.email;
    enquiry.city = this.sendEnquiryForm.value.location;
    enquiry.description = this.sendEnquiryForm.value.requirement;

    return enquiry;
  }

  postEnquiry(): void {
    this._spinnerService.show();
    const requirement = this.mapFormValuesToRquirementModel();
    this._enquiryService.saveEnquiry(requirement).subscribe((result: any) => {
      this.handleSuccess(result);
    }, (error: any) => {
      this.handleError(error);
    });
  }

}
