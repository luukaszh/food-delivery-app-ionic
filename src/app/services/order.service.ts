import { Injectable } from '@angular/core';
import { Order, OrderAdd } from '../shared/models/order';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root' 
})
export class OrderService {
  pay(order: Order): Observable<any> {
    throw new Error('Method not implemented.');
  }

  baseURL = 'http://localhost:3300';

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController
  ) { }

  public postOrder(order: OrderAdd): Subscription{
    console.log('postOrder', order);
    
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

  public getOrders(userId: number): Observable<Order[]> {
    const url = `${this.baseURL}/orders`;
    const params = { userid: userId.toString() };
  
    return this.httpClient.get<Order[]>(url, { params });
  }  

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public updateOrder(order: Order): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/orders/${order.id}`, order);
  }
}
