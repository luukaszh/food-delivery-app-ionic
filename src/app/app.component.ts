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

  user!: User; // Current user object
  cart!: Cart; // Cart object
  cartSubscription: Subscription | undefined; // Subscription for cart updates

  public appPages = [
    { title: 'Home', url: '/home', icon: 'grid' },
    // Other navigation links can be added here
  ];

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private menu: MenuController,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize user and subscribe to cart updates
    this.user = this.userService.currentUser;
    this.cartSubscription = this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
      console.log('Cart Total Count:', this.cart.totalCount);
    });

    // Redirect to login page if user is not logged in
    if (!this.user.token) {
      this.router.navigateByUrl("/login");
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from cart updates to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Logout the user
  public logout(): void {
    this.userService.logout();
  }

  // Toggle the side menu
  toggleMenu() {
    this.menu.toggle();
  }
}
