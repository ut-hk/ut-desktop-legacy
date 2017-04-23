import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

// under systemjs, moment is actually exported as the default export, so we account for that
const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {

  private currentTimer: number;

  private lastTime: Number;
  private lastValue: Date | moment.Moment;
  private lastOmitSuffix: boolean;
  private lastText: string;

  private static getSecondsUntilUpdate(momentInstance: moment.Moment) {
    const howOld = Math.abs(momentConstructor().diff(momentInstance, 'minute'));
    if (howOld < 1) {
      return 1;
    } else if (howOld < 60) {
      return 30;
    } else if (howOld < 180) {
      return 300;
    } else {
      return 3600;
    }
  }

  private static getTime(value: Date | moment.Moment) {
    if (moment.isDate(value)) {
      return value.getTime();
    } else if (moment.isMoment(value)) {
      return value.valueOf();
    } else {
      return momentConstructor(value).valueOf();
    }
  }

  constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) {
  }

  transform(value: Date | moment.Moment, omitSuffix?: boolean): string {
    if (this.hasChanged(value, omitSuffix)) {
      this.lastTime = TimeAgoPipe.getTime(value);
      this.lastValue = value;
      this.lastOmitSuffix = omitSuffix;
      this.removeTimer();
      this.createTimer();
      this.lastText = momentConstructor(value).from(momentConstructor(), omitSuffix);

    } else {
      this.createTimer();
    }

    return this.lastText;
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }


  private createTimer() {
    if (this.currentTimer) {
      return;
    }
    const momentInstance = momentConstructor(this.lastValue);

    const timeToUpdate = TimeAgoPipe.getSecondsUntilUpdate(momentInstance) * 1000;
    this.currentTimer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.lastText = momentConstructor(this.lastValue).from(momentConstructor(), this.lastOmitSuffix);

          this.currentTimer = null;
          this.ngZone.run(() => this.cdRef.markForCheck());
        }, timeToUpdate);
      }
    });
  }

  private removeTimer() {
    if (this.currentTimer) {
      window.clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }
  }

  private hasChanged(value: Date | moment.Moment, omitSuffix?: boolean) {
    return TimeAgoPipe.getTime(value) !== this.lastTime || omitSuffix !== this.lastOmitSuffix;
  }

}
