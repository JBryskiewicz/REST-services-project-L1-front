import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class RequestUtilsService {

  private API_URL: string = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, pseudoParams?: string): Observable<T> {
    if(pseudoParams){
      return this.http.get<T>(`${this.API_URL}/${endpoint}/${pseudoParams}`, { withCredentials: true });
    }
    return this.http.get<T>(`${this.API_URL}/${endpoint}`, { withCredentials: true });

  }

  post<T, B = any>(endpoint: string, body: B): Observable<T> {
    return this.http.post<T>(`${this.API_URL}/${endpoint}`, body);
  }

  put<T, B = any>(endpoint: string, body: B): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}/${endpoint}`);
  }
}
