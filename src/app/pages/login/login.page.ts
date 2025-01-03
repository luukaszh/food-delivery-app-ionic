import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup; // Form group for login form
  isSubmit = false; // Flag to track form submission status

  emailTransl = this.translateSrv.instant("EMAIL")
  loginTransl = this.translateSrv.instant("HOME_MENU_LOGIN")
  passwordTransl = this.translateSrv.instant("PASSWORD")


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private matSnack: MatSnackBar,
    private translateSrv: TranslateService
  ) { }

  ngOnInit(): void {
    // Initialize login form with form controls and validators
    this.loginForm = this.formBuilder.group(
      {
        email: [
          '',
          [Validators.required, Validators.email]
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(2)]
        ]
      });
  }

  onSubmit() {
    this.isSubmit = true; // Set form submission flag to true
    // Check if the password length is less than 2 characters
    if (this.loginForm.controls['password'].value.length < 2) {
      // Show snack bar message for login failed due to minimum character requirement
      this.matSnack.open('Login failed!', 'Minimum 2 characters', {
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "end",
      });
      return;
    }

    // Check if the form is invalid
    if (this.loginForm.invalid)
      return;

    // Call user service to login with the provided credentials
    this.userService.login({
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    })
      .subscribe({
        next: (res) => {
          // Redirect user to homepage after successful login
          this.router.navigateByUrl('/');
        },
      })
  }
}
