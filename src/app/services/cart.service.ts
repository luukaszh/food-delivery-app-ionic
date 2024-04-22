import { Injectable } from '@angular/core';
import { CartItem } from "../shared/models/cartItem";
import { Cart } from "../shared/models/cart";
import { Food } from "../shared/models/food";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Order } from "../shared/models/order";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Initialize cart with data from local storage
  private cart: Cart = this.getFromStorage();

  // Subject to handle cart changes
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  baseURL = 'http://localhost:3300'

  constructor(
    private httpClient: HttpClient,
    private matSnack: MatSnackBar,
    private router: Router
  ) { }

  // Method to add item to cart
  addItemToCart(food: Food): void {
    const existingItem = this.cart.items.find(item => item.food.id === food.id);

    if (existingItem) {
      existingItem.quantity++;
      existingItem.price = existingItem.quantity * food.price;
    } else {
      this.cart.items.push(new CartItem(food));
    }

    this.setToCartStorage();
  } 

  // Method to remove item from cart
  removeItemFromCart(foodId: string): void {
    this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
    this.setToCartStorage();
    if (this.cart.totalCount === 0) {
      this.router.navigateByUrl('/');
    }
  }

  // Method to change quantity of item in cart
  changeCartQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find(item => item.food.id === foodId)

    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setToCartStorage();
  }

  // Method to clear cart
  clearCart() {
    this.cart = new Cart();
    this.setToCartStorage();
    this.router.navigateByUrl('/');
  }

  // Observable to subscribe for cart changes
  public getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  public getCart(): Cart {
    return this.cartSubject.value;
  }

  // Method to set cart data to local storage
  private setToCartStorage(): void {
    const totalPrice = this.cart.items.reduce((sum, item) => sum + parseFloat(item.price.toString()), 0);
    const totalCount = this.cart.items.reduce((sum, item) => sum + parseFloat(item.quantity.toString()), 0);

    const roundedTotalPrice = Math.round(totalPrice * 100) / 100;

    this.cart.totalPrice = roundedTotalPrice;
    this.cart.totalCount = totalCount;

    localStorage.setItem('Cart', JSON.stringify(this.cart));

    this.cartSubject.next(this.cart);
  }

  // Method to get cart data from local storage
  private getFromStorage(): Cart {
    const cartJSON = localStorage.getItem('Cart');
    return cartJSON ? JSON.parse(cartJSON) : new Cart();
  }

  // Method to post order
  postOrder(order: Order): Subscription {
    return this.httpClient.post<Order>(this.baseURL + '/orders', order)
      .subscribe({
        next: (order) => {
          // Show snack bar message for successful order
          this.matSnack.open(JSON.stringify(order.name), 'Successful order!', {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });
        },
        error: (error) => {
          // Show snack bar message for failed order
          this.matSnack.open(JSON.stringify(error), 'Failed order!', {
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });
        }
      })
  }
}
