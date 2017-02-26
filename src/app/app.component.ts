import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isCollapsed: boolean = true;

  constructor() {

  }

  public toggleNavigation() {
    this.isCollapsed = !this.isCollapsed;
  }

  public collapsed(event: any): void {
    console.log(event);
  }

  public expanded(event: any): void {
    console.log(event);
  }
}
