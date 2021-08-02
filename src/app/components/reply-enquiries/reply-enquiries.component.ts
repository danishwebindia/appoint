import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Email } from 'src/app/models/email.model';
import { SendEmailService } from 'src/app/services/send-email.service';

@Component({
  selector: 'app-reply-enquiries',
  templateUrl: './reply-enquiries.component.html',
  styles: [
  ]
})
export class ReplyEnquiriesComponent implements OnInit {

  @Input() enquiryId: number;
  @Input() emailId: string;
  @Output() closePopupEvent = new EventEmitter<void>();
  constructor(
    private _formBuilder: FormBuilder,
    private _sendEmailService: SendEmailService,
    private _toastr: ToastrService,
    private _spinnerService: NgxSpinnerService) {
  }

  formErrors = {
    replymessage: ''
  };

  validationMessages = {
    replymessage: {
      required: 'Name is required.'
    }
  };

  replyEnquiryForm: FormGroup;

  ngOnInit(): void {

    // console.log(this.emailId);

    this.replyEnquiryForm = this._formBuilder.group({
      replymessage: ['', Validators.required]
    });

    this.replyEnquiryForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.replyEnquiryForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
  }

  cancelRequest(): void {
    this.closePop();
  }

  closePop(): void {
    this.closePopupEvent.emit();
  }

  saveReply(): void {
    if (this.replyEnquiryForm.invalid) {
      return;
    }

    const message = this.replyEnquiryForm.get('replymessage').value;
    const emailBody: Email = {
      enquiryId: this.enquiryId,
      toEmail: this.emailId,
      body: message,
      subject: 'Inquiry: Replied'
    };

    this._spinnerService.show();
    this._sendEmailService.sendEmail(emailBody).subscribe((result: any) => {
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
    this.replyEnquiryForm.reset();
    // alert('request callback submitted');
    this._toastr.success('You reply sent successfully.', 'Success');
    this.closePop();
  }

  logValidationErrors(group: FormGroup = this.replyEnquiryForm): void {
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
