import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SearchComponent } from './search/search.component';
import { ModalComponent } from './modal/modal.component';
import { OrderItemsListComponent } from './order-items-list/order-items-list.component';
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    SearchComponent,
    ModalComponent,
    OrderItemsListComponent,
    MapComponent
  ],
  exports: [
    SearchComponent,
    ModalComponent,
    OrderItemsListComponent,
    MapComponent
  ],
  providers: [CurrencyPipe],
})
export class SharedModule { }
