// AI confidence score for this refactoring: 81.53%
import { FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

export function emailValidator(control: AbstractControl): {[key: string]: any} | null {
    const emailRegexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
    return null;
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string): ValidatorFn {
    return (group: FormGroup): {[key: string]: any} | null => {
        const password = group.controls[passwordKey];
        const passwordConfirmation = group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({ mismatchedPasswords: true });
        }
        return null;
    };
}

// Issues:
// 1. Usage of UntypedFormGroup and UntypedFormControl instead of typed equivalents.
// 2. The email regular expression should be enclosed in ^ and $ to ensure a complete match.
// 3. The return type of matchingPasswords function should be specified as ValidatorFn.
// 4. The return statement is missing in the successful case of the matchingPasswords function.
// 5. No semicolon in the return statement of emailValidator function.