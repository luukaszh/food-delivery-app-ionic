import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
    private foodService: FoodService
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

  onSearch(searchValue: string) {
    this.searchText = searchValue.toLowerCase();
  }
}
