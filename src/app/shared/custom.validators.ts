import { AbstractControl, FormGroup } from '@angular/forms';

export class CustomValidators {

    static startingWithEmptySpace() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const ctrlValue: string = control.value;
            if (ctrlValue && ctrlValue.startsWith(' ')) {
                return { 'startingWithEmptySpace': true };
            } else {
                return null;
            }
        };
    }

    // custom validator to check that two fields match
    static MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

}