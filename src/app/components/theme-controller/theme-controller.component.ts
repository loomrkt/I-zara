import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-controller',
  imports: [],
  templateUrl: './theme-controller.component.html',
  styles: ``
})
export class ThemeControllerComponent {
  setTheme( theme: string ) {
    localStorage.setItem( 'theme', theme );
  }
}
