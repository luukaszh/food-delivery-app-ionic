import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order, OrderAdd } from 'src/app/shared/models/order';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  order: Order = new Order();
  checkoutForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private toastController: ToastController,
    private orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    let {name, address} = this.userService.currentUser;
    const cart = this.cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;

    this.order.name = name;
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  public async createOrder() {
    
    if ((this.order.name === "" && this.order.address === "") || (this.order.name === undefined && this.order.address === undefined)) {
      const toast = await this.toastController.create({
        message: `Please fill all the inputs!`,
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return;
    }
    const order: OrderAdd = {
      items: this.order.items,
      totalprice: this.order.totalPrice,
      name: this.order.name,
      address: this.order.address
    };
    const res = this.orderService.postOrder(order)
    console.log('order res:', res);

  }  
}
