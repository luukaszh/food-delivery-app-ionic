import { Injectable } from '@angular/core';
import {Food} from "../shared/models/food";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subscription, tap} from "rxjs";
import { FoodAdd } from "../shared/interfaces/FoodAdd";
import { FoodDelete } from "../shared/interfaces/foodDelete";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  baseURL = 'http://localhost:3300'

  private foodSubject = new BehaviorSubject<Food>(new Food);

  public foodObservable: Observable<Food>

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController
  ) {
    this.foodObservable = this.foodSubject.asObservable();
  }

  public getAll(): Observable<Food[]> {
    return this.httpClient.get<Food[]>(this.baseURL + '/food');
  }

  public addFood(foodAdd: FoodAdd): Observable<Food>{
    console.log('foodSrv | addFood: ', foodAdd)
    return this.httpClient.post<Food>(this.baseURL + '/food/add', foodAdd).pipe(
      tap({
        next: async (food) =>{          
          this.foodSubject.next(food);
          const toast = await this.toastController.create({
            message: `${foodAdd.name} added successfully!`,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        },
        error: async (err) => {
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

  public deleteFood(foodDelete: FoodDelete): Subscription {
    return this.httpClient.delete<Food>(this.baseURL + '/food/' + foodDelete)
      .subscribe({
        next: async (food) => {
          this.foodSubject.next(food);
          const toast = await this.toastController.create({
            message: `Removed successfully!`,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        },
        error: async (err) => {
          const toast = await this.toastController.create({
            message: `Removed failed!`,
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        },
      })
  }
  

  public getFoodById(foodId:string):Observable<Food>{    
    const res = this.httpClient.get<Food>(this.baseURL + '/food/' + foodId);    
    return res;
  }
}
