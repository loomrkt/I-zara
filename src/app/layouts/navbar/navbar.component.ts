import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
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
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        const [path, token] = config.src.split('?token=');
        return `https://firebasestorage.googleapis.com/v0/b/multimediart-f509c.appspot.com/o/assets%2F${encodeURIComponent(
          path
        )}?alt=media&token=${token}`;
      },
    },
  ],
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
  loadingToast: any;

  ngAfterViewInit(): void {
    // Une fois la vue initialisée, nous pouvons accéder à l'élément DOM.
    if (this.dropdownTrigger?.nativeElement) {
      const dropdownElement = this.dropdownTrigger.nativeElement;
      new HSDropdown(dropdownElement); // Initialise HSDropdown sur l'élément DOM
    }
  }

  logout() {
    this.loadingToast = Toastify({
      text: `<div class="flex justify-start items-center gap-3">
              <div class="animate-spin inline-block size-6 border-current border-t-transparent text-white rounded-full" >
                <span class="icon-[line-md--loading-loop] size-6"></span>
              </div>
              deconnexion en cours...</div>
            `,
      className:
        'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-gray-950 p-4',
      duration: -1,
      close: true,
      escapeMarkup: false,
    }).showToast();
    this.authService.logout().subscribe(
      (response) => {
        this.router.navigate(['/']);
        this.loadingToast.hideToast();
        Toastify({
          text: response.message,
          className:
            'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-emerald-500  p-4',
          duration: 3000,
          close: true,
          escapeMarkup: false,
        }).showToast();
      },
      (error) => {
        this.loadingToast.hideToast();
        Toastify({
          text: `<div class="flex justify-start items-center gap-3">
        <div class="animate-spin inline-block size-6 border-current border-t-transparent text-white rounded-full" >
          <span class="icon-[line-md--alert-loop] size-6"></span>
        </div>
        ${error.message}</div>`,
          className:
            'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-red-800 border-red-700  p-4',
          duration: 3000,
          close: true,
          escapeMarkup: false,
        }).showToast();
      }
    );
  }
}
