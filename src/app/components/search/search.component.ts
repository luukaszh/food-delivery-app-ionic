import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  searchTransl = this.translateSrv.instant("SEARCH")

  constructor(
    private translateSrv: TranslateService
  ) { }

  ngOnInit(): void {
  }

  enteredSearchValue: string = ''; // Variable to store the entered search value

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>(); // Event emitter for notifying parent component about search text changes

  onSearchTextChanged() {
    this.searchTextChanged.emit(this.enteredSearchValue); // Emit the entered search value to notify the parent component
    console.log(this.enteredSearchValue); // Log the entered search value (for testing or debugging purposes)
  }
}
