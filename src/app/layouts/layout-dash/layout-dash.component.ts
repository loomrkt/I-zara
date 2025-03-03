import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-layout-dash',
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './layout-dash.component.html',
  styles: ``
})
export class LayoutDashComponent {

}
