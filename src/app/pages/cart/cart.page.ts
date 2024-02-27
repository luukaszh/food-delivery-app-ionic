import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/shared/models/cart';
import { CartItem } from 'src/app/shared/models/cartItem';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cartSubscription: Subscription | undefined;
  cart!: Cart;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  removeItemFromCart(cartItem: CartItem): void {
    this.cartService.removeItemFromCart(cartItem.food.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  changeCartQuantity(cartItem: CartItem, quantityInString: number): void {
    const quantity = quantityInString;
    this.cartService.changeCartQuantity(cartItem.food.id, quantity);
  }
}
