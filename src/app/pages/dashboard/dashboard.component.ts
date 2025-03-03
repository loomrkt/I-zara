import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ListeComponent} from './liste/liste.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgOptimizedImage,
    ListeComponent
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

}
