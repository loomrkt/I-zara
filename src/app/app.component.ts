import { Component } from '@angular/core';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';

import { IStaticMethods } from 'preline/preline';
import {LoaderComponent} from './components/loader/loader.component';
import { AuthService } from './services/auth/auth.service';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'I-zara';
  isLoggedIn = false;
  user: any = null;
  constructor(private router: Router, private authService: AuthService) {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.toggle('dark', false);
    } else {
      document.documentElement.classList.toggle('dark');
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          document.addEventListener('livewire:navigating', () => {
            window.HSStaticMethods.autoInit();
          });

          document.addEventListener('livewire:navigated', () => {
            window.HSStaticMethods.autoInit();
          });
          window.HSStaticMethods.autoInit();
          this.isLoggedIn = true;
        }, 1000);
      }
    });
  }
}
