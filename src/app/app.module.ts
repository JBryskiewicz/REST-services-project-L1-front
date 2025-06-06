import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './routing/app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {BackendConnectorService} from './services/backend-connectors/backend-connector.service';
import {RequestUtilsService} from './services/backend-connectors/request-utils.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { DashboardComponent } from './components/application/dashboard/dashboard.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {JwtInterceptor} from './services/auth-services/jwt.interceptor';
import {SaveViewDialogComponent} from './components/application/dashboard/save-view-dialog/save-view-dialog.component';
import {LoadViewDialogComponent} from './shared/load-view-dialog/load-view-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DashboardComponent,
    LoadViewDialogComponent,
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
    MatIconModule,
    MatOption,
    MatSelect,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatTable,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatIconButton,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    SaveViewDialogComponent,
  ],
  providers: [
    BackendConnectorService,
    RequestUtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
