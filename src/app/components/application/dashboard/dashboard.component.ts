import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BackendConnectorService} from '../../../services/backend-connectors/backend-connector.service';
import {take} from 'rxjs';
import {Destination} from '../../../domain/appDestination.type';
import {TOKEN_KEY, USER_ID} from '../../landing-page/landing-page.component';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SaveViewDialogComponent } from './save-view-dialog/save-view-dialog.component';
import { LoadViewDialogComponent } from '../../../../app/shared/load-view-dialog/load-view-dialog.component';

@Component({
  selector: 'dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  protected isLoggedIn: boolean = false;

  protected areViewsLoaded: boolean = false;

  protected searchForm = new FormGroup({
    search: new FormControl(''),
    country: new FormControl(''),
  });

  protected countryIDs = [
    {id: 'gb', name: 'Great Britain'},
    {id: 'pl', name: 'Poland'},
    {id: 'de', name: 'Germany'},
    {id: 'it', name: 'Italy'},
    {id: 'es', name: 'Spain'},
    {id: 'fr', name: 'France'},
    {id: 'no', name: 'Norway'},
    {id: 'se', name: 'Sweden'},
    {id: 'dk', name: 'Denmark'},
    {id: 'fi', name: 'Finland'},
  ];

  protected searchResult: Destination | null = null;

  displayedColumns: string[] = [
    'city', 'country', 'temp', 'feels_like',
    'pressure', 'windSpeed', 'cloudDensity',
    'visibility', 'sunrise', 'sunset', 'action'
  ];

  protected userDestinationList: Destination[] = [];

  constructor(private backend: BackendConnectorService, private router: Router, private dialog: MatDialog) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.isLoggedIn = true;
    }
    const userId = localStorage.getItem(USER_ID);
    if (userId) {
      this.backend.getAllForUser(userId)
        .pipe(take(1))
        .subscribe(response => {
          this.userDestinationList = response;
          this.areViewsLoaded = true;
        });
    }
  }

  protected onSubmit(): void {
    const searchValue = this.searchForm.value.search;
    const countryValue = this.searchForm.value.country;
    if (!searchValue || searchValue === '') {
      return;
    }
    if (!countryValue || countryValue === '') {
      return;
    }

    this.backend.getSearchResult(searchValue.toLowerCase(), countryValue.toLowerCase())
      .pipe(take(1))
      .subscribe(response => {
        this.searchResult = this.parseResponse(response);
        console.log(this.searchResult);
      });
  }

  private parseResponse(response: any): Destination {
    return {
      city: response.city,
      country: response.country,
      temp: response.temp,
      feels_like: response.feels_like,
      pressure: response.pressure,
      windSpeed: response.windSpeed,
      cloudDensity: response.cloudDensity,
      visibility: response.visibility,
      sunrise: response.sunrise,
      sunset: response.sunset,
    } as Destination
  }

  protected addDestinationToList(destination: Destination): void {
    this.userDestinationList = [...this.userDestinationList, destination];
  }

  protected removeDestinationFromList(destination: Destination): void {
    this.userDestinationList = this.userDestinationList.filter(d => {
      return d.city !== destination.city;
    });
  }

  protected handleLogOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID);
    this.router.navigate(['']);
  }

  protected saveCurrentView(): void {
    // open mat-dialog with one input text
    // result of that dialog goes to viewName field in const data.
    const dialogRef = this.dialog.open(SaveViewDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((viewName: string | null) => {
      if (viewName) {
    const data = {
      userId: localStorage.getItem(USER_ID), // good enough...
      viewName: '',
      destinations: this.userDestinationList
    };

    this.backend.saveUserDestinationView(data)
          .pipe(take(1))
          .subscribe({
            next: () => console.log('View saved successfully'),
            error: (err) => console.error('Failed to save view', err)
          });
      }
    });
  }

  protected loadView(): void {
    // open mat-dialog with list to pick from
    // in dialog send request for user's "destinations"
    // display them
    // add for each button "load", "edit" & "delete"
    // (important), edit should call separate request for PUT, instead of POST. (solution to PUT requirement).
    // on click close dialog and display data from selected view
    // this.userDestinationList = what was loaded from dialog.
    const userId = localStorage.getItem(USER_ID);
    if (!userId) return;

    const dialogRef = this.dialog.open(LoadViewDialogComponent, {
      width: '600px',
      data: { userId }
    });

    dialogRef.afterClosed().subscribe((destinations) => {
      if (destinations) {
        this.userDestinationList = destinations;
      }
    });
  }
}
