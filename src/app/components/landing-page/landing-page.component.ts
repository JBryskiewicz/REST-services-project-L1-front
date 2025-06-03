import {Component} from '@angular/core';
import {FormBuilder, UntypedFormGroup} from '@angular/forms';
import {BackendConnectorService} from '../../services/backend-connectors/backend-connector.service';
import {AppUser} from '../../domain/appUser.type';
import {take, tap} from 'rxjs';
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

  protected errorMessage: string = '';

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
      .pipe(
        take(1),
        tap(() => this.errorMessage = ''),
      )
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(USER_ID, response.userId);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          switch (error.status) {
            case 400:
              this.errorMessage = `${error.status}: Bad request, application request error.`
              break;
            case 401:
              this.errorMessage = `${error.status}: Failed to authorize user.`
              break;
          }
        }
      });
  }

  private registerAction(): void {
    const {email, username, password} = this.loginForm.value;
    this.backendConnector.registerAppUser({email, username, password} as AppUser)
      .pipe(
        take(1),
        tap(() => this.errorMessage = ''),
      )
      .subscribe({
        next: () => {
          this.isLoginMode = true;
        },
        error: (error) => {
          switch (error.status) {
            case 400:
              this.errorMessage = `${error.status}: Failed to register.`;
              break;
          }
        }
      });
  }
}
