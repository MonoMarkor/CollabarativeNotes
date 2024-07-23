import { UsersService } from "../services/users.service";
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidatorFn
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, } from 'rxjs/operators';
import { Injectable } from '@angular/core';

/*export class UsernameValidator implements AsyncValidator {
  constructor(private userService: UsersService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      debounceTime(300),
      switchMap((value) =>
        this.userService.isUsernameTaken(value).pipe(
          map((isTaken) => (isTaken ? { userNotAvailable: true } : null)),
          catchError(() => of(null))
        )
      )
    );
  }
}*/
/*
export function userPresent(userService:UsersService): ValidatorFn {
   /return (control: AbstractControl): ValidationErrors | null => {
        const isPresent = userService.isUsernameTaken(control.value);
        return !isPresent ? null : { userNotAvailable: true };
    };

}

/*export function userPresent(userService: UsersService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return control.valueChanges.pipe(
      debounceTime(1),
      switchMap((value) =>
        userService.isUsernameTaken(value).pipe(
          map((isTaken) => (isTaken ? { userNotAvailable: true } : null)),
          catchError(() => of(null))
        )
      )
    );
  };
}*/
