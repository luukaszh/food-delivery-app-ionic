import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from "rxjs";
import { User } from "../shared/models/user";
import { UserLogin } from "../shared/interfaces/UserLogin";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserRegister } from "../shared/interfaces/UserRegister";
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());

  public userObservable: Observable<User>

  baseURL = 'http://localhost:3300'

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser():User{
    return this.userSubject.value;
  }

  public login(userLogin: UserLogin): Observable<User> {
    return this.httpClient.post<User>(this.baseURL + '/users/login', userLogin).pipe(
      tap({
        next: async (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);

          await this.router.navigateByUrl('/home');
          location.reload();
        },
        error: async (err) => {
          console.error('Login error: ', err);
        }
      })
    );
  }

  public register(userRegister: UserRegister): Subscription {
    return this.httpClient.post<User>(this.baseURL + '/users/register', userRegister)
      .subscribe({
        next: async (user) => {
          this.userSubject.next(user);
          const toast = await this.toastController.create({
            message: `Successful register! Now you can Log in to Our App!`,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        },
        error: async (err) => {
          const toast = await this.toastController.create({
            message: 'Register failed!',
            duration: 5000,
            position: 'bottom'
          });
          toast.present();
        }
      })
  }

  public logout(){    
    this.userSubject.next(new User());
    localStorage.removeItem('User');
    this.router.navigateByUrl('/');
    location.reload();
  }

  public async setUserToLocalStorage(user: User){
    localStorage.setItem('User', JSON.stringify(user));
    localStorage.setItem('token', (user.token));
  }

  public getUserFromLocalStorage():User{
    const userJson = localStorage.getItem('User');
    if(userJson)
      return JSON.parse(userJson) as User;
    return new User();
  }

  public isAdminLoggedIn(user: User){
    return user.isadmin;
  }

  public getToken(){
    return localStorage.getItem('token');
  }
}
