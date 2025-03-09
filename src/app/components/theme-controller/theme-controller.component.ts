import { Component, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-theme-controller',
  imports: [],
  templateUrl: './theme-controller.component.html',
  styles: ``,
})
export class ThemeControllerComponent {
  constructor(private renderer: Renderer2) {}

  setTheme(theme: string) {
    if (theme === 'light') {
      this.renderer.removeClass(document.documentElement, 'dark');
    } else {
      this.renderer.addClass(document.documentElement, 'dark');
    }
    localStorage.setItem('theme', theme);
  }
}
