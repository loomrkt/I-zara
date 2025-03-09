import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ThemeControllerComponent } from '../../components/theme-controller/theme-controller.component';
import { AuthService } from '../../services/auth/auth.service';
import { HSDropdown } from 'preline/preline';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-navbar',
  imports: [NgOptimizedImage, ThemeControllerComponent],
  templateUrl: './navbar.component.html',
  styles: ``,
})
export class NavbarComponent {
  @ViewChild('dropdownTrigger') dropdownTrigger: ElementRef | undefined;
  user: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  isOpen = false;

  ngAfterViewInit(): void {
    // Une fois la vue initialisée, nous pouvons accéder à l'élément DOM.
    if (this.dropdownTrigger?.nativeElement) {
      const dropdownElement = this.dropdownTrigger.nativeElement;
      new HSDropdown(dropdownElement); // Initialise HSDropdown sur l'élément DOM
    }
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      this.router.navigate(['/']);
      Toastify({
        text: res.message,
        className:
          'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-teal-500 bg-teal-400  p-4',
        duration: 3000,
        close: true,
        escapeMarkup: false,
      }).showToast();
    });
  }
}
