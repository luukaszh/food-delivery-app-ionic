import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  registerForm!: FormGroup;

  isSubmit = false;

  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: [
          '',
          [Validators.required]
        ],
        email: [
          '',
          [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(2)]]
      });
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  onSubmit(){
    this.isSubmit = true;
    if(this.registerForm.controls['invalid'])
      return;

    this.userService.register({
      name: this.registerForm.controls['name'].value,
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value
    })
    this.router.navigateByUrl('/')
  }
}
