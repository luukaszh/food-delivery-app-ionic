import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalListComponent } from 'src/app/components/modal copy/modal-list.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/food';
import { Order, ORDER_STATUSES } from 'src/app/shared/models/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  orders: Order[] = [];
  userId = this.userService.currentUser.id;
  isAdmin = this.userService.isAdminLoggedIn(this.userService.currentUser)
  statuses = ORDER_STATUSES;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private modalController: ModalController,
    private foodService: FoodService,
    private toastController: ToastController
  ) {    
  }

  ngOnInit(): void {
    this.loadOrders(this.userId);
  }

  private loadOrders(userId: number): void {
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

  protected async presentModal(foodid: number[]) {
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

  protected getStatusLabel(status: number | undefined): string {
    return this.statuses.find(s => s.value === status)?.label || 'Unknown';
  }

  protected updateStatus(order: Order): void {
    const res = this.orderService.updateOrder(order);
    
    res.subscribe({
      next: (response) => {
        console.log('Status upated sucessfully', response);
      },
      error: (err) => {
        // Jeśli wystąpi błąd, pokazujemy toast
        this.showToast('Status upate Error', 'warning');
      }
    });
  }

  async showToast(message: string, color: string) {
    // Show a toast notification with the food item's name indicating it has been added to the cart
    await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      color,
      buttons: [{
        text: 'OK',
      }]
    }).then(res => res.present());
  }
}