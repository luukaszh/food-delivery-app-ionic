import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/food';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {

  food!: Food;
  foodSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      console.log('aaaaa', param);
      
      if (param['id']) {
        this.foodSubscription = this.foodService.getFoodById(param['id']).subscribe(serverFood => {
          this.food = serverFood;
          console.log('fooood', this.food);
          
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.foodSubscription) {
      this.foodSubscription.unsubscribe();
    }
  }

  public addToCart(): void {
    this.cartService.addItemToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}
