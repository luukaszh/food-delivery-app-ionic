import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'order-items-list',
  templateUrl: './order-items-list.component.html',
  styleUrls: ['./order-items-list.component.scss'],
})
export class OrderItemsListComponent  implements OnInit {

  priceTransl = this.translateSrv.instant("PRICE");
  quantityTransl = this.translateSrv.instant("QUANTITY");
  itemPriceTransl = this.translateSrv.instant("ITEM_PRICE");
  totalTransl = this.translateSrv.instant("TOTAL");

  @Input()
  order!: Order;
  constructor(
    private translateSrv: TranslateService
  ) { }

  ngOnInit() {}

}
