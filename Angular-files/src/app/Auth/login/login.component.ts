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
import { UsersService } from '../../services/users.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { User } from '../../models/user_model';
import { FooterComponent } from '../../footer/footer.component';
import { SignUpSnackbarComponent } from '../sign-up/sign-up.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user = new User('', '', '');

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private router: Router, 
    private userService: UsersService, 
    private _snackBar: MatSnackBar
  ) {}

  get username() {
    return this.loginForm.controls.username;
  }
  get password() {
    return this.loginForm.controls.password;
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SignUpSnackbarComponent, {
      duration: 5000,
    });
  }

  userLogin() {
    this.userService
      .verifyUser(this.username.value, this.password.value)
      .subscribe({
        next: (user) => {
          this.user = user;
          if (this.user.userId) {
            this.openSnackBar();
            this.userService.userLogin(this.user);
            this.router.navigate(['/home']);
          } else {
            alert('logged in failed: wrong credencials');
          }
        },
        error: (err) => {
          console.log(err);
          alert('logged in failed');
        },
      });
  }

  login(): void {
    alert('logged in');
  }
}
