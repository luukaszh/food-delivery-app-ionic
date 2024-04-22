import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order, OrderAdd } from 'src/app/shared/models/order';

declare var paypal: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  order: Order = new Order();
  checkoutForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private toastController: ToastController,
    private orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    paypal.Buttons(
      {
        createOrder: (data: any, actions: any) => {
          console.log('paypal createOrder');

          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: this.order.totalPrice.toString(),
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          console.log('paypal onApprove');
          
          const order: OrderAdd = {
            items: this.order.items,
            totalprice: this.order.totalPrice,
            name: this.order.name,
            address: this.order.address
          };

          const payment = await actions.order.capture();
          order.paymentId = payment.id;
          this.orderService.postOrder(order);
          this.cartService.clearCart();
        },
        
        onError: (err: any) => {
          this.showToast('Payment Failed', 'warning');
          console.warn('paypal onError', err);
        },

        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          tagline: false,
      },
    
      }
    ).render(this.paypalElement.nativeElement)


    let {name, address} = this.userService.currentUser;
    const cart = this.cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;

    this.order.name = name;
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
