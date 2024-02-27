import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { Food } from 'src/app/shared/models/food';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input()
  foodData!: Food;

  constructor(
    private modalController: ModalController,
    private cartService: CartService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log(this.foodData);
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async addToCart() {
    this.cartService.addItemToCart(this.foodData);
    await this.modalController.dismiss();
    this.showToast();
  }

  async showToast() {
    await this.toastController.create({
      message: `${this.foodData.name} added to cart!`,
      duration: 4000,
      position: 'bottom',
      color: '',
      buttons: [{
        text: 'OK',
      }]
    }).then(res => res.present());
  }
}
