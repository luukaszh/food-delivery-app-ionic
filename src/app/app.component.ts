import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './shared/models/user';
import { CartService } from './services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from './shared/models/cart';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  user!: User
  cart!: Cart;
  cartSubscription: Subscription | undefined;

  public appPages = [
    { title: 'Home', url: '/home', icon: 'grid' },
  ];
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private menu: MenuController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.currentUser;
    this.cartSubscription = this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      console.log('aaaaaaa', this.cart.totalCount);
    });
    if (!this.user.token) {
      this.router.navigateByUrl("/login")
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  public logout(): void {
    this.userService.logout();
  }

  toggleMenu() {    
    this.menu.toggle();
  }
}
