import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-pagination-advanced',
  templateUrl: './pagination-advanced.html'
})
export class NgbdPaginationAdvanced {
  page = 1;
  cs = 120; // 120
  limit = 5; // 5

  pageChanged(page) {
    console.log(page);
  }
}
