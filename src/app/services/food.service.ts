import { Injectable } from '@angular/core';
import { Food } from "../shared/models/food";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subscription, tap } from "rxjs";
import { FoodAdd } from "../shared/interfaces/FoodAdd";
import { FoodDelete } from "../shared/interfaces/foodDelete";
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  baseURL = 'http://localhost:3300'

  // Subject to handle food data
  private foodSubject = new BehaviorSubject<Food>(new Food);

  // Observable to subscribe for food changes
  public foodObservable: Observable<Food>

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController
  ) {
    // Initializing foodObservable with foodSubject
    this.foodObservable = this.foodSubject.asObservable();
  }

  // Method to get all food items
  public getAll(): Observable<Food[]> {
    return this.httpClient.get<Food[]>(this.baseURL + '/food');
  }

  // Method to add a new food item
  public addFood(foodAdd: FoodAdd): Observable<Food> {
    console.log('foodSrv | addFood: ', foodAdd)
    return this.httpClient.post<Food>(this.baseURL + '/food/add', foodAdd).pipe(
      tap({
        next: async (food) => {
          this.foodSubject.next(food);
          // Show toast message for successful addition
          const toast = await this.toastController.create({
            message: `${foodAdd.name} added successfully!`,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        },
        error: async (err) => {
          // Show toast message for failed addition
          const toast = await this.toastController.create({
            message: `${foodAdd.name} add failed!`,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        },
      })
    );
  }

  // Method to delete a food item
  public deleteFood(foodDelete: FoodDelete): Subscription {
    return this.httpClient.delete<Food>(this.baseURL + '/food/' + foodDelete)
      .subscribe({
        next: async (food) => {
          this.foodSubject.next(food);
          // Show toast message for successful removal
          const toast = await this.toastController.create({
            message: `Removed successfully!`,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        },
        error: async (err) => {
          // Show toast message for failed removal
          const toast = await this.toastController.create({
            message: `Removed failed!`,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        },
      })
  }

  // Method to get a food item by its ID
  public getFoodById(foodId: string): Observable<Food> {
    return this.httpClient.get<Food>(this.baseURL + '/food/' + foodId);
  }
}
