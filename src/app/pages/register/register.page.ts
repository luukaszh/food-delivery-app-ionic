import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup; // Form group for registration form
  isSubmit = false; // Flag to track form submission status
  returnUrl = ''; // Return URL after registration

  nameTranslation = this.translateSrv.instant("NAME")
  emailTranslation = this.translateSrv.instant("EMAIL")
  passwordTranslation = this.translateSrv.instant("PASSWORD")
  registerTranslation = this.translateSrv.instant("REGISTER")

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateSrv: TranslateService
  ) { }

  ngOnInit(): void {
    // Initialize registration form with form controls and validators
    this.registerForm = this.formBuilder.group(
      {
        name: [
          '',
          [Validators.required]
        ],
        email: [
          '',
          [Validators.required, Validators.email]
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(2)]
        ]
      });
    // Get return URL from query params
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  onSubmit() {
    this.isSubmit = true; // Set form submission flag to true
    // Check if the form is invalid
    if (this.registerForm.invalid)
      return;

    // Call user service to register the user with the provided details
    this.userService.register({
      name: this.registerForm.controls['name'].value,
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value
    });

    // Redirect user to the return URL or homepage after registration
    this.router.navigateByUrl(this.returnUrl || '/');
  }
}
