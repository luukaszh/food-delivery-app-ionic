import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalListComponent } from 'src/app/components/modal copy/modal-list.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
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
  isAdmin = this.userService.isAdminLoggedIn(this.userService.currentUser)

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private modalController: ModalController,
    private foodService: FoodService
  ) {    
  }

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

  async presentModal(foodid: number[]) {
    console.log(foodid);
    
    this.foodService.getFoodByIds(foodid).subscribe(async res => {
      console.log('food ids tab', res);
      const modal = await this.modalController.create({
        component: ModalListComponent,
        componentProps: {
          foodData: res
        }
      });

      return await modal.present();
    })
  }
}