import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ThemeControllerComponent} from '../../components/theme-controller/theme-controller.component';

@Component({
  selector: 'app-navbar',
  imports: [
    NgOptimizedImage,
    ThemeControllerComponent
  ],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

}
