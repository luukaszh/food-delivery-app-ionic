import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalListComponent } from 'src/app/components/modal copy/modal-list.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { EmailService } from 'src/app/services/email.service';
import { FoodService } from 'src/app/services/food.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Food } from 'src/app/shared/models/food';
import { Order, ORDER_STATUSES } from 'src/app/shared/models/order';
import { User } from 'src/app/shared/models/user';

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

  subject: string = 'Order Status Update';

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private modalController: ModalController,
    private foodService: FoodService,
    private toastController: ToastController,
    private emailService: EmailService
  ) {    
  }

  ngOnInit(): void {
    this.loadOrders(this.userId);
  }

  private loadOrders(userId: number): void {
    const sub = this.orderService.getOrders(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        console.log('Orders:', this.orders);
        sub.unsubscribe();
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        sub.unsubscribe();
      }
    });
  }

  protected async presentModal(foodid: number[]) {
    console.log(foodid);
    
    const sub = this.foodService.getFoodByIds(foodid).subscribe(async res => {
      console.log('food ids tab', res);
      const modal = await this.modalController.create({
        component: ModalListComponent,
        componentProps: {
          foodData: res
        }
      });

      sub.unsubscribe();
      return await modal.present();
    })
  }

  protected getStatusLabel(status: number | undefined): string {
    return this.statuses.find(s => s.value === status)?.label || 'Unknown';
  }

  protected updateStatus(order: Order): void {
    const res = this.orderService.updateOrder(order);
    
    const sub = res.subscribe({
      next: (response) => {
        console.log('Status upated sucessfully', response, order.userid);

        if (order.userid !== undefined) {
          const userSub = this.userService.getUserById(+order.userid).subscribe({
            next: (data) => {
              
              const user: User = data;
              this.sendEmail(order.status, +order.id, user.email);
              userSub.unsubscribe();
            },
            error: (err) => {
              console.error('Error fetching user:', err);
              userSub.unsubscribe();
            },
          });
        }

        sub.unsubscribe();
      },
      error: (err) => {
        this.showToast('Status upate Error', 'warning');
        sub.unsubscribe();
      }
    });
  }

  private sendEmail(status: number | undefined, orderId: number, email: string): void {
    if (!status || !orderId || !email) {
      return;
    }
    
    const sub = this.emailService.sendEmail(email, this.subject, this.generateEmailText(status, orderId)).subscribe({
      next: (response) => {
        console.log('Email sent successfully:', response);
        sub.unsubscribe()
      },
      error: (error) => {
        console.error('Error sending email:', error);
        this.showToast('An error occurred while sending the email.', 'warning');
        sub.unsubscribe()
      },
    });
  }

  private generateEmailText(status: number | undefined, orderId: number): string {
    const statusLabel = ORDER_STATUSES.find(s => s.value === status)?.label || 'Unknown';
    return `Your order with ID ${orderId} has been updated to the status: ${statusLabel}. Thank you for choosing us!`;
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