import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-layout-auth',
    imports: [
        RouterOutlet,
        NgOptimizedImage
    ],
  templateUrl: './layout-auth.component.html',
  styles: ``
})
export class LayoutAuthComponent {

}
