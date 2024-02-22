import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './shared/models/user';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  user!: User

  public appPages = [
    { title: 'Home', url: '/home', icon: 'grid' },
    { title: 'Cart', url: '/cart', icon: 'cart' }
  ];
  public additionalButtons = [
    { title: 'Logout', icon: 'log-out' }
  ]
  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.currentUser;
  }

  public logout(): void {
    this.userService.logout();
  }
}
