import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { Food } from 'src/app/shared/models/food';

@Component({
  selector: 'app-modal-list',
  templateUrl: './modal-list.component.html',
  styleUrls: ['./modal-list.component.scss'],
})
export class ModalListComponent implements OnInit {

  @Input()
  foodData!: Food[]; // Input property to receive the food data from the parent component

  constructor(
    private modalController: ModalController,
    private cartService: CartService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log('ModalComponent foodData',this.foodData); // Log the received food data when the component initializes
  }

  async closeModal() {
    await this.modalController.dismiss(); // Close the modal
  }
}
