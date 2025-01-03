import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Food } from 'src/app/shared/models/food';

@Component({
  selector: 'app-modal-list',
  templateUrl: './modal-list.component.html',
  styleUrls: ['./modal-list.component.scss'],
})
export class ModalListComponent implements OnInit {

  @Input()
  foodData!: Food[]; // Input property to receive the food data from the parent component

  foodListTransl = this.translateSrv.instant('FOOD_LIST');
  cookTimeTransl = this.translateSrv.instant('COOK_TIME2');
  priceTransl = this.translateSrv.instant('PRICE');

  constructor(
    private modalController: ModalController,
    private translateSrv: TranslateService
  ) { }

  ngOnInit() {
    console.log('ModalComponent foodData',this.foodData); // Log the received food data when the component initializes
  }

  async closeModal() {
    await this.modalController.dismiss(); // Close the modal
  }
}
