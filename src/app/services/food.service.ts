import { Injectable } from '@angular/core';
import {Food} from "../shared/models/food";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subscription, tap} from "rxjs";
import { FoodAdd } from "../shared/interfaces/FoodAdd";
import { FoodDelete } from "../shared/interfaces/foodDelete";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  baseURL = 'http://localhost:3300'

  private foodSubject = new BehaviorSubject<Food>(new Food);

  public foodObservable: Observable<Food>

  constructor(
    private httpClient: HttpClient,
    private matSnack: MatSnackBar,
  ) {
    this.foodObservable = this.foodSubject.asObservable();
  }

  getAll(): Observable<Food[]> {
    return this.httpClient.get<Food[]>(this.baseURL + '/food');
  }

  addFood(foodAdd: FoodAdd): Observable<Food>{
    console.log('foodSrv | addFood: ', foodAdd)
    return this.httpClient.post<Food>(this.baseURL + '/food/add', foodAdd).pipe(
      tap({
        next: (food) =>{
          this.foodSubject.next(food);
          this.matSnack.open(JSON.stringify(food.name), 'Successful food added!',{
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });
          window.location.reload()
        },
        error: (err) => {
          this.matSnack.open(JSON.stringify(err.error.text), 'Add food failed!',{
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });        }
      })
    );
  }

  deleteFood(foodDelete: FoodDelete): Subscription {
    return this.httpClient.delete<Food>(this.baseURL + '/food/' + foodDelete)
      .subscribe({
        next: (food) => {
          this.foodSubject.next(food);
          this.matSnack.open(JSON.stringify(food.name), 'Successful food delete!',{
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });
          window.location.reload()
        },
        error: (err) => {
          this.matSnack.open(JSON.stringify(err.error.text), 'Delete food failed!',{
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "end",
          });
        }
      })
  }

  getFoodById(foodId:string):Observable<Food>{    
    console.log('res', foodId);
    const res = this.httpClient.get<Food>(this.baseURL + '/food/' + foodId);
    console.log('res', res);
    
    return res;
  }
}
