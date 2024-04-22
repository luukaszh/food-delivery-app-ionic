import { Injectable } from '@angular/core';
import { Order, OrderAdd } from '../shared/models/order';
import { Observable, Subscription, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseURL = 'http://localhost:3300';

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController
  ) { }

  // public addOrder(order: OrderAdd): Subscription {
  //   console.log('addOrder',order);
  //   return this.httpClient.post<Order>(`${this.baseURL}/orders/add`, order).pipe(
  //     tap({
  //       next: async (order) => {
  //         console.log('here1');
          
  //         // this.updateFoodList();
  //         // Show toast message for successful addition
  //         await this.presentToast(`Order created successfully!`);
  //       },
  //       error: async (err) => {
  //         console.log('here2');

  //         // Show toast message for failed addition
  //         await this.presentToast(`Order create failed!`);
  //       },
  //     })
  //   );
  // }

  postOrder(order: OrderAdd): Subscription{
    console.log('postOrder', order.totalprice, typeof order.totalprice);
    
    return this.httpClient.post<OrderAdd>(this.baseURL + '/orders', order)
      .subscribe({
        next: (order) =>{
          this.presentToast(`Order created successfully!`);
        },
        error: (error) => {
          this.presentToast(`Order create failed!`);
        }
      })
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
