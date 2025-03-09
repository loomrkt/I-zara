import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-continue-with-google',
  imports: [],
  templateUrl: './continueWithGoogle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContinueWithGoogleComponent {
  constructor(private authService: AuthService) {}

  googleLogin(): void {
    this.authService.loginWithGoogle();
  }
 }
