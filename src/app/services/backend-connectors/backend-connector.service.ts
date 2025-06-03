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

  public check(): Observable<any> {
    return this.requestUtils.get(this.APP_CONTROLLER, 'check');
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

  public getAllForUser(userId: string): Observable<any> {
    return this.requestUtils.get<any>(this.APP_CONTROLLER, `getAllForUser/${userId}`);
  }

  public saveUserDestinationView(data: {
    userId: string | null;
    viewName: string;
    // destinations?: Destination[];
    regionInfo: string;
  }): Observable<void> {
    return this.requestUtils.post<void>(`${this.APP_CONTROLLER}/saveView`, data);
  }

  public getUserDestinationViews(userId: string): Observable<UserDestinationView[]> {
    return this.requestUtils.get<UserDestinationView[]>(this.APP_CONTROLLER, `getAllForUser/${userId}`);
  }

  public getSingleUserView(viewId: string): Observable<UserDestinationView> {
    return this.requestUtils.get<UserDestinationView>(this.APP_CONTROLLER, `getUserView/${viewId}`);
  }

  public editUserDestinationView(data: UserDestinationView): Observable<UserDestinationView> {
    return this.requestUtils.put<UserDestinationView>(`${this.APP_CONTROLLER}/editView`, data);
  }

  public deleteUserDestinationView(id: number): Observable<void> {
    return this.requestUtils.delete<void>(`${this.APP_CONTROLLER}/deleteUserView/${id}`);
  }

  //save -> post (body)
  //edit -> put
  //load -> get
  //delete -> delete

}
