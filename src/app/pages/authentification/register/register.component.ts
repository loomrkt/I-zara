import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContinueWithGoogleComponent } from '../../../components/continueWithGoogle/continueWithGoogle.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ContinueWithGoogleComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent {
  registerForm = new FormGroup(
    {
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
      validationPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const validationPassword = group.get('validationPassword')?.value;

    return password === validationPassword ? null : { passwordMismatch: true };
  }

  showPassword = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}
  register() {
    if (this.registerForm.valid) {
      this.authService
        .register(
          this.registerForm.value.email!,
          this.registerForm.value.password!
        )
        .subscribe({
          next: (response) => {
            Toastify({
              text: 'Inscription réussie, veuillez vous connecter',
              className:
                'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-teal-500 bg-teal-400  p-4',
              duration: 3000,
              close: true,
              escapeMarkup: false,
            }).showToast();
            console.log(response);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = error.message;
            Toastify({
              text: this.errorMessage,
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
