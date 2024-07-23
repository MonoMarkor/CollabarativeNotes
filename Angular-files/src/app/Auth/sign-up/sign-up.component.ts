import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  NG_ASYNC_VALIDATORS,
  FormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatOption,
} from '@angular/material/autocomplete';
import { passwordValidator } from '../passwordStrength.directive';
//import { userPresent } from '../usercheck.directive';
import { UsersService } from '../../services/users.service';
import { passwordsMatch } from '../passwordMatch.directive';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { User } from '../../models/user_model';
import { FooterComponent } from '../../footer/footer.component';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  user = new User('', '', '');

  createForm = new FormGroup(
    {
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password1: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, passwordValidator()],
      }),
      password2: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, passwordValidator()],
      }),
    },
    { validators: passwordsMatch('password1', 'password2') }
  );

  constructor(
    private _snackBar: MatSnackBar,
    private userService: UsersService,
    private router: Router
  ) {}

  openSnackBar() {
    this._snackBar.openFromComponent(SignUpSnackbarComponent, {
      duration: 5000,
    });
  }

  createAccount(): void {
    this.userService.checkUsernameAvailibillty(this.username.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.username_available) {
          this.userService
            .createAccount(this.username.value, this.password2.value)
            .subscribe({
              next: (user) => {
                this.user = user;
                if (this.user.userId) {
                  this.openSnackBar();
                  this.userService.userLogin(this.user);
                  this.router.navigate(['/home']);
                } else {
                  alert('Accout Creation Failed');
                }
              },
              error: (err) => {
                alert('Accout Creation Failed');
                console.log(err);
              },
            });
        } else {
          alert('Username is taken. Try another Username');
        }
      },
    });
    //    this.openSnackBar();
  }
  /*get username() {
    return this.createForm.get('username');
  }*/

  get password1() {
    return this.createForm.get('password1');
  }

  get username() {
    return this.createForm.controls.username;
  }
  get password2() {
    return this.createForm.controls.password2;
  }
}

@Component({
  selector: 'sign-in-snack',
  templateUrl: 'sign-up-snackbar.html',
  styles: `
    :host {
      display: flex;
    }

    .snack {
      color: hotpink;
    }
  `,
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatIcon,
  ],
})
export class SignUpSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
