import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm! : FormGroup;

  isSubmit = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private matSnack: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: [
          '',
          [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(2)]]
      });
  }

  onSubmit(){
    this.isSubmit = true;
    console.log(this.loginForm.controls['password'].value.length)
    if (this.loginForm.controls['password'].value.length < 2) {
      this.matSnack.open('Login failed!', 'Minimum 2 characters', {
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "end",
      });
      return;
    }

    if(this.loginForm.invalid)
      return;

    this.userService.login({
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    })
      .subscribe({
        next: (res) =>{
          this.router.navigateByUrl('/');
        },
      })
  }
}
