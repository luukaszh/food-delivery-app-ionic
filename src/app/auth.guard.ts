import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "./services/user.service";
import { User } from "./shared/models/user";
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  user!: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  async canActivate() {    
    if (this.userService.isAuthorized()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      const toast = await this.toastController.create({
        message: `Log in to access!`,
        duration: 500,
        position: 'bottom'
      });
      toast.present();
      return false;
    }
  }

}
