import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Person} from "../_models/person";
import {Observable} from "rxjs";
import {Advertisement} from "../_models/advertisement";

// const HOST: string = 'http://localhost:8080';
const HOST: string = 'https://investigation-backend.us-east-2.elasticbeanstalk.com';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static SKIP_INTERCEPTOR_HEADER = new HttpHeaders().set('InterceptorSkipHeader', 'SKIP_HEADER');

  constructor(private httpClient: HttpClient) {}


  public getApplicationSettings():Observable<any>  {
    return this.httpClient.get<any>(HOST + "/api/getApplicationSettings", { headers: ApiService.SKIP_INTERCEPTOR_HEADER });
  }

  public loginPerson(person: Person): Observable<HttpResponse<Person>>  {
    let url = HOST + '/api/person/do-login?username=' + person.username + "&password=" + person.password;
    return this.httpClient.post<Person>(url,{}, { observe: 'response' });
  }

  public getPersons(){
    return this.httpClient.get(HOST + '/api/person');
  }

  public registerPerson(person: Person) : Observable<Person> {
    return this.httpClient.post<Person>(HOST + '/api/person/register', person);
  }

  public getCurrentPerson(): Observable<Person> {
    return this.httpClient.get<Person>(HOST + '/api/person/current');
  }

  public addAdvertisement(item: Advertisement): Observable<any> {
    return this.httpClient.post(HOST + '/api/rental/addAdvertisement', item);
  }

  public logout(): Observable<Object> {
    return this.httpClient.get(HOST + "/logout");
  }


}

