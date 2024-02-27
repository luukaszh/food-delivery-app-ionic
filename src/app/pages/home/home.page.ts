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

  foods: Food[] = []; // Array to store food items
  searchText: string = ''; // Variable to store search text
  foodSubscription!: Subscription; // Subscription for food data

  constructor(
    private foodService: FoodService,
    private modalController: ModalController,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Subscribe to get all food items from the server
    this.foodSubscription = this.foodService.getAll().subscribe((serverFoods) => {
      console.log(serverFoods);
      this.foods = serverFoods; // Update the food array with server data
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from food data subscription to avoid memory leaks
    if (this.foodSubscription) {
      this.foodSubscription.unsubscribe();
    }
  }

  // Method to handle search functionality
  public onSearch(searchValue: string) {
    this.searchText = searchValue.toLowerCase(); // Convert search value to lowercase
  }

  // Method to present modal with food details
  async presentModal(food: Food) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        foodData: food // Pass food data as component property
      }
    });
    return await modal.present(); // Present the modal
  }

  // Method to add a food item to the cart
  public addToCart(food: Food): void {
    this.cartService.addItemToCart(food); // Call cart service to add item to cart
  }
}
