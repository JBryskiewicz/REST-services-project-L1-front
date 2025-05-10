import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class RequestUtilsService {

  private API_URL: string = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${endpoint}`, { params });
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
