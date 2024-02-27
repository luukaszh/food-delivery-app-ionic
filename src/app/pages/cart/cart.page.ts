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

  cartSubscription: Subscription | undefined; // Subscription for cart data
  cart!: Cart; // Cart object to store cart data

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    // Subscribe to get cart data updates
    this.cartSubscription = this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart; // Update the cart object with new cart data
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from cart data subscription to avoid memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Method to remove item from cart
  removeItemFromCart(cartItem: CartItem): void {
    this.cartService.removeItemFromCart(cartItem.food.id); // Call cart service to remove item from cart
  }

  // Method to clear the entire cart
  clearCart(): void {
    this.cartService.clearCart(); // Call cart service to clear cart
  }

  // Method to change quantity of an item in cart
  changeCartQuantity(cartItem: CartItem, quantityInString: number): void {
    const quantity = quantityInString; // Parse quantity from string to number
    this.cartService.changeCartQuantity(cartItem.food.id, quantity); // Call cart service to change item quantity
  }
}
