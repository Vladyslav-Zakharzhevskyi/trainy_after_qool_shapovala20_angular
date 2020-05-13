import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Person} from '../_models/person';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ResponseEntity} from '../_models/response-entity';
import {RequestType} from '../_models/request-type.enum';

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static SKIP_INTERCEPTOR_HEADER = new HttpHeaders().set('InterceptorSkipHeader', 'SKIP_HEADER');

  constructor(private httpClient: HttpClient) {
    console.log(`Server url: ${environment.apiUrl}`);
    console.log(`Is production: ${environment.production}`);
  }


  public getApplicationSettings(): Observable<any> {
    return this.httpClient.get<any>(HOST + '/api/getApplicationSettings', { headers: ApiService.SKIP_INTERCEPTOR_HEADER });
  }

  public loginPerson(person: Person): Observable<HttpResponse<Person>>  {
    const url = `${HOST}/api/person/do-login?username=${person.userName}&password=${encodeURIComponent(person.password)}`;

    return this.httpClient.post<Person>(url, {}, { observe: 'response' });
  }

  public getPersons() {
    return this.httpClient.get(HOST + '/api/person/all');
  }

  public checkUsernameAvailability(username: string): Observable<object> {
    return this.httpClient.post(HOST + '/api/person/checkUserNameAvailability/' + username, {});
  }

  public confirmEmail(token: string): Observable<ResponseEntity> {
    return this.httpClient.get<ResponseEntity>(`${HOST}/api/person/confirmEmail?token=${token}`);
  }

  public registerPerson(person: Person): Observable<Person> {
    return this.httpClient.post<Person>(HOST + '/api/person/register', person);
  }

  public getCurrentPerson(): Observable<Person> {
    return this.httpClient.get<Person>(HOST + '/api/person/');
  }

  public savePerson(person: Person): Observable<Person> {
    return this.httpClient.put<Person>(`${HOST}/api/person/`, person);
  }

  public getServerData(type: RequestType, resource: string): Observable<any> {
    if (type === RequestType.REPOSITORY) {
      resource = `${resource}Repository`;
    }

    return this.httpClient.get(`${HOST}/api/getDataByType/${type}/${resource}`);
  }

  public logout(): Observable<object> {
    return this.httpClient.get(`${HOST}/logout`);
  }


}

