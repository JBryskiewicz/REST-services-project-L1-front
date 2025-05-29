import {Injectable} from '@angular/core';
import {AppUser} from '../../domain/appUser.type';
import {Observable} from 'rxjs';
import {RequestUtilsService} from './request-utils.service';
import {Destination} from '../../domain/appDestination.type';
import {UserDestinationView} from '../../domain/appDestination.type';

@Injectable()
export class BackendConnectorService {


  private USER_CONTROLLER = 'user';
  private APP_CONTROLLER = 'main';

  constructor(private requestUtils: RequestUtilsService) {
  }

  public registerAppUser(user: AppUser): Observable<any> {
    return this.requestUtils.post(`${this.USER_CONTROLLER}/register`, user);
  }

  public loginAppUser(user: AppUser): Observable<any> {
    const loginData = {username: user.email, password: user.password};
    return this.requestUtils.post(`${this.USER_CONTROLLER}/generateToken`, loginData);
  }


  public getSearchResult(search: string, countryID: string): Observable<any> {
    return this.requestUtils.get<any>(this.APP_CONTROLLER, `getLocationData/${search}/${countryID}`);
  }

  public saveUserDestinations(payload: { username: string, destinations: Destination[] }): Observable<any> {
    return this.requestUtils.post('user-destinations/save', payload);
  }

  public getUserDestinationViews(userId: string): Observable<UserDestinationView[]> {
    return this.requestUtils.get<UserDestinationView[]>(`${this.USER_CONTROLLER}/views/${userId}`);
  }

  public deleteUserDestinationView(userId: string): Observable<void> {
    return this.requestUtils.delete<void>(`${this.USER_CONTROLLER}/views/${userId}`);
  }


  //save -> post (body)
  //load -> get
  //delete -> delete

}
