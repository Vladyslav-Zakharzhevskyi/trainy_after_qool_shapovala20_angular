import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Person } from '../_models/person';
import { Observable } from 'rxjs';
import { Advertisement } from '../_models/advertisement';
import { environment } from '../../environments/environment';

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static SKIP_INTERCEPTOR_HEADER = new HttpHeaders().set('InterceptorSkipHeader', 'SKIP_HEADER');

  constructor(private httpClient: HttpClient) {
    console.log(`Is production: ${environment.production}`);
  }


  public getApplicationSettings(): Observable<any>  {
    return this.httpClient.get<any>(HOST + '/api/getApplicationSettings', { headers: ApiService.SKIP_INTERCEPTOR_HEADER });
  }

  public loginPerson(person: Person): Observable<HttpResponse<Person>>  {
    const url = HOST + '/api/person/do-login?username=' + person.username + '&password=' + person.password;

    return this.httpClient.post<Person>(url, {}, { observe: 'response' });
  }

  public getPersons() {
    return this.httpClient.get(HOST + '/api/person/all');
  }

  public registerPerson(person: Person): Observable<Person> {
    return this.httpClient.post<Person>(HOST + '/api/person/register', person);
  }

  public checkUsernameAvailability(username: string): Observable<object> {
    return this.httpClient.post(HOST + '/api/person/checkUserNameAvailability/' + username, {});
  }

  public getCurrentPerson(): Observable<Person> {
    return this.httpClient.get<Person>(HOST + '/api/person/current');
  }

  public addAdvertisement(item: Advertisement): Observable<any> {
    return this.httpClient.post(HOST + '/api/rental/advertisement', item);
  }

  public getAdvertisements(): Observable<any> {
    return this.httpClient.get<Advertisement>(HOST + '/api/rental/advertisement');
  }

  public logout(): Observable<object> {
    return this.httpClient.get(HOST + '/logout');
  }


}

