import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Navbar2Component} from '../navbar2/navbar2.component';

@Component({
  selector: 'app-layout-download',
  imports: [
    RouterOutlet,
    Navbar2Component
  ],
  templateUrl: './layout-download.component.html',
  styles: ``
})
export class LayoutDownloadComponent {

}
