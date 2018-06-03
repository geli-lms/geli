import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';

interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
}

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {

  @Input()
  scrollCallback; // callback function which should return an observable

  @Input()
  scrollPercent = 90;  //until this percentage the user should scroll the container for the event to be emitted

  @Input()
  shouldEmit = false; // yes or not the directive should emit an event when scrollPercent is reached.


  private scrollEvent$;

  constructor(private elm: ElementRef) {
    this.init();
  }

  init() {
    this.scrollEvent$ = Observable.fromEvent(this.elm.nativeElement, 'scroll');
    this.scrollEvent$.map((e: any): ScrollPosition => ({
      sH: e.target.scrollHeight,
      sT: e.target.scrollTop,
      cH: e.target.clientHeight
    }))
      .pairwise()
      .filter(positions => this.isScrollingUp(positions) && this.isScrollExpectedPercent(positions[1]))
      .exhaustMap(() => {
        if (this.shouldEmit) {
          return this.scrollCallback();
        }
      })
      .subscribe(() => {
      });
  }

  /**
   * return true if the user is scrolling up otherwise false
   * @param positions
   * @returns {boolean}
   */
  isScrollingUp(positions) {
    return positions[0].sT > positions[1].sT;
  }

  /**
   * return true if percentage of scroll after which to load more data is reached
   * @param position
   * @returns {boolean}
   */
  isScrollExpectedPercent = (position) => {
    return ((position.sT + position.cH) / position.sH) < (this.scrollPercent / 100);
  }

}
