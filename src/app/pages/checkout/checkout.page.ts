import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastColor, ToastService } from 'src/app/services/toast.service';
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

  checkoutTransl = this.translateSrv.instant("CHECKOUT");
  nameTransl = this.translateSrv.instant("NAME");
  addressTransl = this.translateSrv.instant("ADDRESS_MAP");
  chooseTransl = this.translateSrv.instant("CHOOSE_ON_MAP");

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private toastController: ToastController,
    private orderService: OrderService,
    private translateSrv: TranslateService,
    private toastSrv: ToastService
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
                  value: this.order.totalprice.toString(),
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          console.log('paypal onApprove');
          
          const order: OrderAdd = {
            items: this.order.items,
            totalprice: this.order.totalprice,
            userid: this.userService.currentUser.id,
            name: this.order.name,
            address: this.order.address,
            status: 1
          };

          const payment = await actions.order.capture();
          order.paymentId = payment.id;
          this.orderService.postOrder(order);
          this.cartService.clearCart();
        },
        
        onError: (err: any) => {
          this.toastSrv.showToast(this.translateSrv.instant("PAYMENT_FAILED"), ToastColor.Warning);
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
    this.order.totalprice = cart.totalprice;

    this.order.name = name;
  }
}
