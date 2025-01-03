import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SearchComponent } from './search/search.component';
import { ModalComponent } from './modal/modal.component';
import { OrderItemsListComponent } from './order-items-list/order-items-list.component';
import { MapComponent } from './map/map.component';
import { ModalListComponent } from './modal copy/modal-list.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [
    SearchComponent,
    ModalComponent,
    ModalListComponent,
    OrderItemsListComponent,
    MapComponent
  ],
  exports: [
    SearchComponent,
    ModalComponent,
    ModalListComponent,
    OrderItemsListComponent,
    MapComponent
  ],
  providers: [CurrencyPipe],
})
export class SharedModule { }
