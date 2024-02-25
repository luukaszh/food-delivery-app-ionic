import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/food';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  foods: Food[] = [];
  searchText: string = '';
  foodSubscription!: Subscription;

  constructor(
    private foodService: FoodService,
    private modalController: ModalController,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.foodSubscription = this.foodService.getAll().subscribe((serverFoods) => {
      console.log(serverFoods);
      this.foods = serverFoods;
    });
  }

  ngOnDestroy(): void {
    if (this.foodSubscription) {
      this.foodSubscription.unsubscribe();
    }
  }

  public onSearch(searchValue: string) {
    this.searchText = searchValue.toLowerCase();
  }

  async presentModal(food: Food) {    
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        foodData: food
      }
    });
    return await modal.present();
  }

  public addToCart(food: Food): void {
    this.cartService.addItemToCart(food);
  }
}
