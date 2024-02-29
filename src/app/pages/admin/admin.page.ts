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
  foods: Food[] = [];  // Array to store food items
  isSubmit = false;  // Flag to track form submission status
  addForm!: FormGroup;  // Form group for adding food
  selected!: FoodDelete;  // Variable to store selected food item for deletion
  authData = true;  // Placeholder for authentication data (assuming it's hardcoded to true for now)
  foodObservable!: Observable<Food[]>;  // Observable for food data
  editForm!: FormGroup;  // Form group for editing food
  editFoodSelected!: Food;  // Variable to store the selected food item for editing

  // Array defining form fields for adding food
  formFields: any[] = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Name' },
    { name: 'price', label: 'Price', type: 'number', placeholder: 'Price' },
    { name: 'cooktime', label: 'Cook time [min]', type: 'text', placeholder: 'Cook time [min]' },
    { name: 'imageurl', label: 'Image url', type: 'text', placeholder: 'Image url' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' }
  ];

  // Form fields for editing food
  editFormFields: { name: keyof Food; label: string; type: string; placeholder: string }[] = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Name' },
    { name: 'price', label: 'Price', type: 'text', placeholder: 'Price' },
    { name: 'cooktime', label: 'Cook time [min]', type: 'text', placeholder: 'Cook time [min]' },
    { name: 'imageurl', label: 'Image url', type: 'text', placeholder: 'Image url' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' }
  ];

  constructor(
    private foodService: FoodService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    // Initialize the form for adding food
    this.initializeForm();
    // Initialize the form for editing food
    this.initializeEditForm();
    // Fetch initial food data
    this.getNewFoodFromObservable();
  }

  // Method to handle form submission for adding food
  public onAddSubmit() {
    this.isSubmit = true;
    if (this.addForm.invalid) {
      return;
    }
    this.foodService.addFood(this.addForm.value).subscribe(() => {
      this.getNewFoodFromObservable();
    });
    this.addForm.reset();
  }

  // Method to initialize the form for adding food
  private initializeForm(): void {
    const formGroup: { [key: string]: any } = {};
    this.formFields.forEach(field => {
      formGroup[field.name] = ['', Validators.required];
    });
    this.addForm = this.formBuilder.group(formGroup);
  }

  // Method to initialize the form for editing food
  private initializeEditForm(): void {
    const formGroup: { [key: string]: any } = {};
    this.editFormFields.forEach(field => {
      formGroup[field.name] = ['', Validators.required];
    });
    this.editForm = this.formBuilder.group(formGroup);
  }

  // Method to update the edit form with selected food data
  public updateEditForm(): void {
    const formGroup: { [key: string]: any } = {};
    this.editFormFields.forEach(field => {
      formGroup[field.name] = [this.editFoodSelected[field.name], Validators.required];
    });
    this.editForm = this.formBuilder.group(formGroup);
  }

  // Method to handle form submission for editing food
  public onEditSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }
    const editedFood: Food = { ...this.editForm.value, id: this.editFoodSelected.id.toString() };
    this.foodService.updateFood(editedFood).subscribe(() => {
      this.getNewFoodFromObservable();
      this.editForm.reset();
    });
  }

  // Method to handle form submission for deleting food
  public onDeleteSubmit() {
    if (!this.selected || typeof this.selected === 'undefined') {
      return;
    }
    this.foodService.deleteFood(this.selected);
    this.getNewFoodFromObservable();
  }

  // Method to fetch new food data from the observable
  private getNewFoodFromObservable(): void {
    this.foodObservable = this.foodService.getAll();
    this.foodObservable.subscribe((serverFoods) => {
      this.foods = serverFoods;
    })
  }
}
