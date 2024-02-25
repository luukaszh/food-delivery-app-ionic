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

  foods: Food[] = [];
  isSubmit = false;
  addForm! : FormGroup;
  selected!: FoodDelete;
  authData = true;
  foodObservable!: Observable<Food[]>;

  formFields: any[] = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Name' },
    { name: 'price', label: 'Price', type: 'number', placeholder: 'Price' },
    { name: 'cooktime', label: 'Cook time', type: 'text', placeholder: 'CookTime' },
    { name: 'imageurl', label: 'Image Url', type: 'text', placeholder: 'ImageUrl' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' }
  ];

  constructor(
    private foodService: FoodService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getNewFoodFromObservable()
  }

  public onSubmit() {
    this.isSubmit = true;
    if (this.addForm.invalid)
      return;
  
    this.foodService.addFood(this.addForm.value).subscribe(() => {
      window.location.reload();
    });
  }

  private initializeForm(): void {
    const formGroup: { [key: string]: any } = {};
    this.formFields.forEach(field => {
      formGroup[field.name] = ['', Validators.required];
    });
    this.addForm = this.formBuilder.group(formGroup);
  }
  

  public onDeleteSubmit(){
      this.foodService.deleteFood(this.selected);
      this.getNewFoodFromObservable()
  }

  private getNewFoodFromObservable(): void{
    this.foodObservable = this.foodService.getAll();    
    this.foodObservable.subscribe((serverFoods) => {
      this.foods = serverFoods;
    })
  }
}
