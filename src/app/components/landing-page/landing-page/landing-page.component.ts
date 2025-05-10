import {Component} from '@angular/core';
import {FormBuilder, UntypedFormGroup} from '@angular/forms';
import {BackendConnectorService} from '../../../services/backend-connectors/backend-connector.service';
import {AppUser} from '../../../domain/appUser.type';
import {take} from 'rxjs';

const INIT_FORM = {username: '', password: ''}

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
    const {username, password} = this.loginForm.value;
    this.backendConnector.loginAppUser({username, password} as AppUser)
      .pipe(take(1))
      .subscribe((response) => {
        console.log(response);
      })
  }

  private registerAction(): void {
    const {username, password} = this.loginForm.value;
    this.backendConnector.registerAppUser({username, password} as AppUser)
      .pipe(take(1))
      .subscribe((response) => {
        console.log(response);
      })
  }
}
