import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BackendConnectorService} from '../../../services/backend-connectors/backend-connector.service';
import {take} from 'rxjs';
import {Destination} from '../../../domain/appDestination.type';
import {TOKEN_KEY} from '../../landing-page/landing-page.component';
import {Router} from '@angular/router';

@Component({
  selector: 'dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  protected searchForm = new FormGroup({
    search: new FormControl(''),
    country: new FormControl(''),
  });

  protected isLoggedIn: boolean = false;

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

  constructor(private backend: BackendConnectorService, private router: Router,) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.isLoggedIn = true;
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
    this.router.navigate(['']);
  }

  protected saveCurrentView(): void {
    const data = {userId: '', destinations: this.userDestinationList}
    // Request to backend.
  }

  protected loadView(): void {
    // open mat-dialog with list to pick from
    // in dialog send request for user's "destinations"
    // display them
    // add for each button "load" & "delete"
    // on click close dialog and display data from selected view
    // this.userDestinationList = what was loaded from dialog.
  }
}
