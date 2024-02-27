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
  foodData!: Food; // Input property to receive the food data from the parent component

  constructor(
    private modalController: ModalController,
    private cartService: CartService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log(this.foodData); // Log the received food data when the component initializes
  }

  async closeModal() {
    await this.modalController.dismiss(); // Close the modal
  }

  async addToCart() {
    this.cartService.addItemToCart(this.foodData); // Add the food item to the cart using the cart service
    await this.modalController.dismiss(); // Close the modal
    this.showToast(); // Show a toast notification indicating that the item has been added to the cart
  }

  async showToast() {
    // Show a toast notification with the food item's name indicating it has been added to the cart
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
