import {Injectable} from '@angular/core';
import {AppUser} from '../../domain/appUser.type';
import {Observable} from 'rxjs';
import {RequestUtilsService} from './request-utils.service';

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
    return this.requestUtils.post(`${this.USER_CONTROLLER}/login`, user);
  }

  public getSearchResult(search: string, countryID: string): Observable<any> {
    return this.requestUtils.get<any>(this.APP_CONTROLLER, `getLocationData/${search}/${countryID}`);
  }

}
