import { Component } from '@angular/core';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';

import { IStaticMethods } from 'preline/preline';
import {LoaderComponent} from './components/loader/loader.component';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'I-zara';
  isLoggedIn = false;
  constructor(private router: Router) {
    if (localStorage.getItem('theme') === 'dark'){
      document.documentElement.classList.toggle(
        'dark',
      )
    }
    else {
      document.documentElement.classList.toggle(
        'dark', false
      )
    }
  }


  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
          this.isLoggedIn = true;
        }, 3000);
      }
    });
  }
}
