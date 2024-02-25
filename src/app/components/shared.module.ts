import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SearchComponent } from './search/search.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    SearchComponent,
    ModalComponent
  ],
  exports: [
    SearchComponent,
    ModalComponent
  ],
  providers: [CurrencyPipe],
})
export class SharedModule {}
