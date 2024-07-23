import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatch(password: string, confirmPassword: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(password);
    const confirmPasswordControl = control.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null; // controls are not yet defined
    }

    const passwordValue = passwordControl.value;
    const confirmPasswordValue = confirmPasswordControl.value;

    return passwordValue === confirmPasswordValue ? null : { passwordsMismatch: true };
  };
}
