import { Injectable } from '@angular/core';
import { Order, OrderAdd } from '../shared/models/order';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root' 
})
export class OrderService {
  pay(order: Order): Observable<any> {
    throw new Error('Method not implemented.');
  }

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController
  ) { }

  public postOrder(order: OrderAdd): Subscription{
    console.log('postOrder', order);
    
    return this.httpClient.post<OrderAdd>(baseURL + '/orders', order)
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
    const url = `${baseURL}/orders`;
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
    return this.httpClient.put(`${baseURL}/orders/${order.id}`, order);
  }
}
