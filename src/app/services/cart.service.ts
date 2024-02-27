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

  private cart: Cart = this.getFromStorage();

  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  baseURL = 'http://localhost:3300'

  constructor(
    private httpClient: HttpClient,
    private matSnack: MatSnackBar,
    private router: Router
  ) { }

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

  removeItemFromCart(foodId: string): void {
    this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
    this.setToCartStorage()
    if (this.cart.totalCount === 0) {
      this.router.navigateByUrl('/');
    }
  }

  changeCartQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find(item => item.food.id === foodId)
    console.log('CartService|changeCartQuantity|cartItem:', cartItem);

    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setToCartStorage()
  }

  clearCart() {
    this.cart = new Cart();
    this.setToCartStorage()
    this.router.navigateByUrl('/')
  }

  public getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  private setToCartStorage(): void {
    console.log('CartService|setToCartStorage|cart.items', this.cart.items);
    const totalPrice = this.cart.items.reduce((sum, item) => sum + parseFloat(item.price.toString()), 0);
    const totalCount = this.cart.items.reduce((sum, item) => sum + parseFloat(item.quantity.toString()), 0);

    const roundedTotalPrice = Math.round(totalPrice * 100) / 100;

    this.cart.totalPrice = roundedTotalPrice;
    this.cart.totalCount = totalCount;

    localStorage.setItem('Cart', JSON.stringify(this.cart));

    this.cartSubject.next(this.cart);
  }

  private getFromStorage(): Cart {
    const cartJSON = localStorage.getItem('Cart');
    return cartJSON ? JSON.parse(cartJSON) : new Cart();
  }

  postOrder(order: Order): Subscription {
    return this.httpClient.post<Order>(this.baseURL + '/orders', order)
      .subscribe({
        next: (order) => {
          this.matSnack.open(JSON.stringify(order.name), 'Successful order!', {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });
        },
        error: (error) => {
          this.matSnack.open(JSON.stringify(error), 'Failed order!', {
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });
        }
      })
  }
}
