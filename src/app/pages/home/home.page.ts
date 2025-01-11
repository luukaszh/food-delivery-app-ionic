import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { ToastColor, ToastService } from 'src/app/services/toast.service';
import { Food } from 'src/app/shared/models/food';

export enum FoodCategory {
  All = 'all',
  Food = 'food',
  Drinks = 'drinks',
  Desserts = 'desserts'
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  foods: Food[] = []; // Array to store food items
  searchText: string = ''; // Variable to store search text
  foodSubscription!: Subscription; // Subscription for food data
  averageRating: number = 0;
  sub: Subscription | undefined;

  selectedCategory: string = FoodCategory.All;
  categories: { key: string; value: string }[] = [];

  constructor(
    private foodService: FoodService,
    private modalController: ModalController,
    private cartService: CartService,
    private toastController: ToastController,
    private translateSrv: TranslateService,
    private toastSrv: ToastService
  ) {}
  
  ngOnInit(): void {
    // Subscribe to get all food items from the server
    this.foodSubscription = this.foodService.getAll().subscribe((serverFoods) => {
      console.log(serverFoods);
      this.foods = serverFoods.sort((a: Food, b: Food) => +a.id - +b.id);
    });

    this.loadCategories();
  }
  OnDestroy(): void{
    console.log('HomePage | closed');
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  protected submitRating(event: any, foodId: string): void {    
    if (event.detail < 1 || event.detail > 5) {
      alert('Ocena musi być w przedziale 1-5!');
      return;
    }
  
    this.sub = this.foodService.sendRating(+foodId, event.detail).subscribe({
      next: async (res) => {
        await this.toastSrv.showToast('Thank you for your rating!', ToastColor.Primary);
  
        // Pobierz wszystkie produkty i zastosuj filtrację dla wybranej kategorii
        this.sub = this.foodService.getAll().subscribe(res => {          
          const category = this.selectedCategory !== 'all' ? this.selectedCategory : '';
          const filteredFoods = category
            ? res.filter((food: Food) => food.category === category)
            : res;
  
          this.foods = filteredFoods.sort((a: Food, b: Food) => +a.id - +b.id);
        });
      },
      error: (err) => {
        this.toastSrv.showToast('An error occurred while sending the rating.', ToastColor.Warning);
        console.error(err);
      },
    });
  }
  

  protected calculateAverageRating(ratings: number[]): number {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return sum / ratings.length;
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
    this.showAddedFoodToast(food);
  }

  protected onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.loadFoods();
  }

  private loadFoods() {
    this.foodService.getAll().subscribe((foods) => {
      const filteredFoods = this.selectedCategory !== 'all'
        ? foods.filter(food => food.category === this.selectedCategory)
        : foods;
  
      this.foods = filteredFoods.sort((a, b) => +a.id - +b.id);
    });
  }

  loadCategories(): void {
    this.categories = Object.entries(FoodCategory).map(([key, value]) => ({
      key,
      value,
    }));

    this.loadFoods();
  }
  
  async showAddedFoodToast(foodData: Food) {
    // Show a toast notification with the food item's name indicating it has been added to the cart
    await this.toastController.create({
      message: `${foodData.name} added to cart!`,
      duration: 4000,
      position: 'bottom',
      color: '',
      buttons: [{
        text: 'OK',
      }]
    }).then(res => res.present());
  }
}
