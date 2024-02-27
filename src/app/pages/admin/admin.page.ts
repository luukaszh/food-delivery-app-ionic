import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { FoodDelete } from 'src/app/shared/interfaces/foodDelete';
import { Food } from 'src/app/shared/models/food';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  foods: Food[] = []; // Array to store food items
  isSubmit = false; // Flag to track form submission status
  addForm!: FormGroup; // Form group for adding food
  selected!: FoodDelete; // Variable to store selected food item for deletion
  authData = true; // Placeholder for authentication data (assuming it's hardcoded to true for now)
  foodObservable!: Observable<Food[]>; // Observable for food data

  formFields: any[] = [ // Array defining form fields for adding food
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Name' },
    { name: 'price', label: 'Price', type: 'number', placeholder: 'Price' },
    { name: 'cooktime', label: 'Cook time', type: 'text', placeholder: 'Cook time' },
    { name: 'imageurl', label: 'Image url', type: 'text', placeholder: 'Image url' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' }
  ];

  constructor(
    private foodService: FoodService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form for adding food
    this.getNewFoodFromObservable(); // Fetch initial food data
  }

  public onAddSubmit() {
    this.isSubmit = true; // Set form submission flag to true
    if (this.addForm.invalid) {
      return; // If the form is invalid, do nothing
    }
    // Add new food item using the food service and subscribe to get updated food data
    this.foodService.addFood(this.addForm.value).subscribe(() => {
      this.getNewFoodFromObservable();
    });
    this.addForm.reset(); // Reset the form after submission
  }

  private initializeForm(): void {
    const formGroup: { [key: string]: any } = {};
    // Loop through form fields and initialize form controls with validators
    this.formFields.forEach(field => {
      formGroup[field.name] = ['', Validators.required];
    });
    this.addForm = this.formBuilder.group(formGroup); // Create form group with initialized form controls
  }

  public onDeleteSubmit() {
    if (!this.selected || typeof this.selected === 'undefined') {
      return; // If no food item is selected for deletion, do nothing
    }
    // Call food service to delete selected food item and fetch updated food data
    this.foodService.deleteFood(this.selected);
    this.getNewFoodFromObservable();
  }

  private getNewFoodFromObservable(): void {
    // Get observable for food data from the food service and subscribe to update the foods array
    this.foodObservable = this.foodService.getAll();
    this.foodObservable.subscribe((serverFoods) => {
      this.foods = serverFoods;
    })
  }
}
