import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from "rxjs";
import { User } from "../shared/models/user";
import { UserLogin } from "../shared/interfaces/UserLogin";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserRegister } from "../shared/interfaces/UserRegister";
import { ToastController } from '@ionic/angular';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());

  public userObservable: Observable<User>

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {
    this.userObservable = this.userSubject.asObservable();
  }

  // Get current user from BehaviorSubject
  public get currentUser(): User {
    return this.userSubject.value;
  }

  public getUserById(id: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/users/${id}`);
  }

  // Method for user login
  public login(userLogin: UserLogin): Observable<User> {
    return this.httpClient.post<User>(baseURL + '/users/login', userLogin).pipe(
      tap({
        next: async (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);

          // Redirect to home page after successful login
          await this.router.navigateByUrl('/home');
          location.reload();
        },
        error: async (err) => {
          console.error('Login error: ', err);
        }
      })
    );
  }

  // Method for user registration
  public register(userRegister: UserRegister): Subscription {
    return this.httpClient.post<User>(baseURL + '/users/register', userRegister)
      .subscribe({
        next: async (user) => {
          this.userSubject.next(user);
          // Show toast message for successful registration
          const toast = await this.toastController.create({
            message: `Successful register! Now you can Log in to Our App!`,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        },
        error: async (err) => {
          // Show toast message for failed registration
          const toast = await this.toastController.create({
            message: 'Register failed!',
            duration: 5000,
            position: 'bottom'
          });
          toast.present();
        }
      })
  }

  // Method for user logout
  public logout() {
    this.userSubject.next(new User());
    localStorage.removeItem('User');
    this.router.navigateByUrl('/');
    localStorage.setItem('token', '');
    location.reload();
  }

  // Method to set user data to local storage
  public async setUserToLocalStorage(user: User) {
    localStorage.setItem('User', JSON.stringify(user));
    localStorage.setItem('token', (user.token));
  }

  // Method to get user data from local storage
  public getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem('User');
    if (userJson)
      return JSON.parse(userJson) as User;
    return new User();
  }

  // Method to check if user is admin
  public isAdminLoggedIn(user: User) {
    return user.isadmin;
  }

  // Method to get user token from local storage
  public getToken() {    
    return localStorage.getItem('token');
  }

  public isAuthorized() {
    if (this.getToken() === '' || this.getToken() === undefined) {
      return false;
    }
    return true;
  }
}
