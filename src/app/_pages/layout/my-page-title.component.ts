import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-my-page-title',
  templateUrl: './my-page-title.component.html',
})
export class MyPageTitleComponent {

  private _routerLinkValue = '';

  @Input() heading;
  @Input() subheading;
  @Input() icon;
  @Input() 
  set routerLinkValue(routerLinkValue) {
    this._routerLinkValue = routerLinkValue;
  }

  get routerLinkValue() { return this._routerLinkValue; }

}
