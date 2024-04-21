import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/order';

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
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastController: ToastController
  ) { }

  ngOnInit(): void {
    let {name, address} = this.userService.currentUser;
    const cart = this.cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;

    this.checkoutForm = this.formBuilder.group({
      name:[name, Validators.required],
      address:[address, Validators.required]
    })

  }

  get fc() {
    return this.checkoutForm.controls;
  }

  public async createOrder() {
    if (this.checkoutForm.invalid) {
      const toast = await this.toastController.create({
        message: `Please fill all the inputs!`,
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
      return;
    }
  
    this.order.name = this.fc['name'].value;
    this.order.address = this.fc['address'].value;
  }  
}
