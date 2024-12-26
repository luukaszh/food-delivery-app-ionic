import { Component, OnInit } from '@angular/core';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/food';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  orders: Order[] = [];
  userId = this.userService.currentUser.id;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.loadOrders(this.userId);
  }

  loadOrders(userId: number): void {
    this.orderService.getOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Orders:', this.orders);
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
      }
    });
  }
}