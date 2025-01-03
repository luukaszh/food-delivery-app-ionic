import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './shared/models/user';
import { CartService } from './services/cart.service';
import { Subscription } from 'rxjs';
import { Cart } from './shared/models/cart';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OrderService } from './services/order.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  currentLang = "en"

  orderLen: number | undefined;
  user!: User; // Current user object
  cart!: Cart; // Cart object
  cartSubscription: Subscription | undefined; // Subscription for cart updates
  orderSubscription: Subscription | undefined; // Subscription for cart updates

  welcomeTitle = this.translateSrv.instant('HOME_WELCOME');
  adminMenuTitle = this.translateSrv.instant('HOME_MENU_ADMIN');
  cartMenuTitle = this.translateSrv.instant('HOME_MENU_CART');
  yourOrderMenuTitle = this.translateSrv.instant('HOME_MENU_YOUR_ORDER');
  logoutMenuTitle = this.translateSrv.instant('HOME_MENU_LOGOUT');
  loginMenuTitle = this.translateSrv.instant('HOME_MENU_LOGIN');
  registerMenuTitle = this.translateSrv.instant('HOME_MENU_REGISTER');
  selectLangMenuTitle = this.translateSrv.instant('SELECT_LANGUAGE');
  cancelTransl = this.translateSrv.instant('CANCEL');

  public appPages = [
    { title: this.translateSrv.instant('HOME_MENU_HOME'), url: '/home', icon: 'grid' },
    // Other navigation links can be added here
  ];

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private menu: MenuController,
    private router: Router,
    private orderService: OrderService,
    private translateSrv: TranslateService
  ) {
    console.log(this.welcomeTitle);
    
    this.loadLanguageFromLocalStorage();
  }

  ngOnInit(): void {
    // Initialize user and subscribe to cart updates
    this.user = this.userService.currentUser;
    this.cartSubscription = this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });

    this.orderSubscription = this.orderService.getOrders(this.user.id).subscribe((order) => {
      this.orderLen = order.length;
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

  public toggleTheme(event: { detail: { checked: any; }; }) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark')
    } else {
      document.body.setAttribute('color-theme', 'light')
    }
  }

  public setLanguage(lang: string): void {
    this.translateSrv.use(lang);
    this.currentLang = lang;
    localStorage.setItem('language', lang);
  }

  private loadLanguageFromLocalStorage(): void {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('en');
    }
  }
}
