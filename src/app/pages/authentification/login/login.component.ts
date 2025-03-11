import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ContinueWithGoogleComponent } from '../../../components/continueWithGoogle/continueWithGoogle.component';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ContinueWithGoogleComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      ),
    ]),
  });
  showPassword = false;
  loadingToast: any;
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.loginForm.valid) {
      this.loadingToast = Toastify({
        text: `<div class="flex justify-start items-center gap-3">
        <div class="animate-spin inline-block size-6 border-current border-t-transparent text-white rounded-full" >
          <span class="icon-[line-md--loading-loop] size-6"></span>
        </div>
        Connecion en cours...</div>
`,

        className:
          'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-gray-950 p-4',
        duration: -1,
        close: true,
        escapeMarkup: false,
      }).showToast();
      this.authService
        .login(this.loginForm.value.email!, this.loginForm.value.password!)
        .subscribe({
          next: (response) => {
            this.loadingToast.hideToast();
            Toastify({
              text: `<div class="flex justify-start items-center gap-3">
              <div class="animate-spin inline-block size-6 border-current border-t-transparent text-white rounded-full" >
                <span class="icon-[line-md--circle-twotone-to-confirm-circle-transition]"></span>
              </div>
              Connexion bien effectuer</div>`,
              className:
                'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-emerald-500  p-4',
              duration: 3000,
              close: true,
              escapeMarkup: false,
            }).showToast();
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
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
            console.error('Erreur de connexion:', error);
          },
        });
    }
  }
}
