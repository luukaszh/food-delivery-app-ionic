import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, Subscription, tap } from "rxjs";
import { Food } from "../shared/models/food";
import { FoodAdd } from "../shared/interfaces/FoodAdd";
import { FoodDelete } from "../shared/interfaces/foodDelete";
import { ToastController } from '@ionic/angular';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  // Subject to handle food data
  private foodSubject = new BehaviorSubject<Food[]>([]);

  // Observable to subscribe for food changes
  public foodObservable: Observable<Food[]> = this.foodSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController
  ) {}

  // Method to get all food items
  public getAll(): Observable<Food[]> {
    return this.httpClient.get<Food[]>(`${baseURL}/food`);
  }

  // Method to add a new food item
  public addFood(foodAdd: FoodAdd): Observable<Food> {
    return this.httpClient.post<Food>(`${baseURL}/food/add`, foodAdd).pipe(
      tap({
        next: async (food) => {
          this.updateFoodList();
          // Show toast message for successful addition
          await this.presentToast(`${foodAdd.name} added successfully!`);
        },
        error: async (err) => {
          // Show toast message for failed addition
          await this.presentToast(`${foodAdd.name} add failed!`);
        },
      })
    );
  }

  // Method to delete a food item
  public deleteFood(foodDelete: FoodDelete): Subscription {
    return this.httpClient.delete<Food>(`${baseURL}/food/${foodDelete}`).subscribe({
      next: async () => {
        this.updateFoodList();
        // Show toast message for successful removal
        await this.presentToast(`Removed successfully!`);
      },
      error: async () => {
        // Show toast message for failed removal
        await this.presentToast(`Removed failed!`);
      },
    });
  }

  // Method to update a food item
  public updateFood(foodEdit: Food): Observable<Food> {
    return this.httpClient.put<Food>(`${baseURL}/food/${foodEdit.id}`, foodEdit).pipe(
      tap({
        next: async () => {
          this.updateFoodList();
          // Show toast message for successful update
          await this.presentToast(`${foodEdit.name} updated successfully!`);
        },
        error: async () => {
          // Show toast message for failed update
          await this.presentToast(`${foodEdit.name} update failed!`);
        },
      })
    );
  }

  // Method to get a food item by its ID
  public getFoodByIds(ids: number[]): Observable<Food[]> {
    const params = new HttpParams().set('ids', ids.join(',')); // Tworzenie parametrów zapytania

    return this.httpClient.get<Food[]>(`${baseURL}/foodids`, { params });
  }

  // Metoda do wysyłania oceny
  public sendRating(foodId: number, rating: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/food/${foodId}/rate`, { rating });
  }

  // Metoda do pobierania średniej oceny
  public getAverageRating(foodId: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/food/${foodId}/average-rating`);
  }

  // Method to update the food list after any CRUD operation
  private updateFoodList(): void {
    this.getAll().subscribe((foods) => {
      this.foodSubject.next(foods);
    });
  }

  // Method to present a toast message
  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
