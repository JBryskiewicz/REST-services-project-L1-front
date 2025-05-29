import {Component} from '@angular/core';
import {FormBuilder, UntypedFormGroup} from '@angular/forms';
import {BackendConnectorService} from '../../services/backend-connectors/backend-connector.service';
import {AppUser} from '../../domain/appUser.type';
import {take} from 'rxjs';
import {Router} from '@angular/router';

const INIT_FORM = {
  username: '',
  email: '',
  password: ''
}

export const TOKEN_KEY = 'jwtToken';
export const USER_ID = 'REST-user-id';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  protected loginForm: UntypedFormGroup;

  protected isLoginMode: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private backendConnector: BackendConnectorService,
  ) {
    this.loginForm = this.formBuilder.group(INIT_FORM);
  }

  protected switchLoginMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  protected handleLoginOrRegister(): void {
    this.isLoginMode
      ? this.loginAction()
      : this.registerAction();
  }

  private loginAction(): void {
    const {email, username, password} = this.loginForm.value;
    this.backendConnector.loginAppUser({email, username, password} as AppUser)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(USER_ID, response.userId);
          console.log(localStorage);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          // temp code, should add remove from storage if token expired.
        }
      });
  }

  private registerAction(): void {
    const {email, username, password} = this.loginForm.value;
    this.backendConnector.registerAppUser({email, username, password} as AppUser)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoginMode = true;
      })
  }
}
