import { LandingPageComponent } from './components/landing-page/landing-page/landing-page.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './routing/app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {BackendConnectorService} from './services/backend-connectors/backend-connector.service';
import {RequestUtilsService} from './services/backend-connectors/request-utils.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatLabel,
    MatInput,
    MatLabel,
    MatFormField,
    MatButton,
  ],
  providers: [
    BackendConnectorService,
    RequestUtilsService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
