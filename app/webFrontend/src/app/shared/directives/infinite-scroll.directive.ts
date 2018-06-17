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

enum ScrollDirection {
  UP  ='up',
  DOWN = 'down'
}

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective {

  @Input()
  scrollCallback; // callback function which should return an observable

  @Input()
  scrollPercent = 100;  //until this percentage the user should scroll the container for the event to be emitted

  @Input()
  shouldEmit = true;
  @Input()
  scrollDirection = ScrollDirection.UP;

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
      .filter(positions => this.onScroll(positions) && this.isScrollPercentReached(positions[1]))
      .exhaustMap(() => {
        if (this.shouldEmit) {
          return this.scrollCallback();
        }
      })
      .subscribe(() => {
      });
  }


  onScroll(positions) {
    switch (this.scrollDirection) {
      case ScrollDirection.UP:
        return positions[0].sT > positions[1].sT;
      case ScrollDirection.DOWN:
        return positions[0].sT < positions[1].sT;
      default:
        return  positions[0].sT > positions[1].sT;
    }

  }


  isScrollPercentReached = (position) => {
    switch (this.scrollDirection) {
      case ScrollDirection.UP:
        return ((position.sT + position.cH) / position.sH) < (this.scrollPercent / 100);
      case ScrollDirection.DOWN:
        return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
      default:
          return ((position.sT + position.cH) / position.sH) < (this.scrollPercent / 100);
    }
  }

}
