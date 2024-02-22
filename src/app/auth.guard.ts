import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from "./services/user.service";
import { User } from "./shared/models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  user!: User;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  canActivate(){
    if(this.userService.isAdminLoggedIn(this.user)){
      return true;
    } else {
      return this.router.navigateByUrl('**');
    }
  }

}
