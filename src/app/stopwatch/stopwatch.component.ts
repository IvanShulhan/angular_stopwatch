import { Component } from '@angular/core';
import {
  buffer,
  debounceTime,
  filter,
  fromEvent,
  interval
} from 'rxjs';


@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent {
  initialValue = 0;
  currentTime = '00 : 00';
  isActive = false;
  timer$: any;
  doubleClick$: any;
  firstBuffering = true;

  convertNumberToString = (num: number) => num > 9 ? num : '0' + num

  setCurrentTime = (sec: number) => {
    const seconds = this.convertNumberToString(sec % 60);
    const minutes = this.convertNumberToString(Math.floor(sec / 60));

    this.currentTime = `${minutes} : ${seconds}`
  }

  startTimer() {
    this.timer$ = interval(1000).subscribe(() => {
      this.initialValue++;
      this.setCurrentTime(this.initialValue);
    })
  }

  stopTimer() {
    this.initialValue = 0;
    this.setCurrentTime(this.initialValue);
    this.timer$.unsubscribe();
  }

  startStopTimer() {
    if (!this.isActive) {
      this.startTimer();
    } else {
      this.stopTimer();
    }

    this.isActive = !this.isActive;
  }

  pauseTimer(event: MouseEvent) {
    const element = event.target as HTMLButtonElement;
    const click$ = fromEvent(element, 'click');

    this.doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(500))),
      filter(clicks => this.firstBuffering ? true : clicks.length > 1)
    )
    .subscribe(() => {
      this.firstBuffering = false;
      this.isActive = false;
      this.timer$.unsubscribe();
    })
  }

  resetTimer() {
    this.stopTimer();
    this.startTimer();
    this.isActive = true;
  }
}
