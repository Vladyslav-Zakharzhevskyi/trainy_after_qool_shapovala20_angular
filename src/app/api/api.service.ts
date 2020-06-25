import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Person } from '../_models/person';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseEntity } from '../_models/response-entity';
import { RequestType } from '../_models/request-type.enum';
import { Offer } from '../_models/offer';

const HOST = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static SKIP_INTERCEPTOR_HEADER = new HttpHeaders().set('InterceptorSkipHeader', 'SKIP_HEADER');

  constructor(private httpClient: HttpClient) {
    console.log(`Backend connection: ${environment.name}`);
    console.log(`Description: ${environment.description}`);
    console.log(`Is prod: ${environment.production}`);
    console.log(`Backend url: ${environment.apiUrl}`);
  }


  public getApplicationSettings(): Observable<any> {
    return this.httpClient.get<any>(`${HOST}/api/getApplicationSettings`, { headers: ApiService.SKIP_INTERCEPTOR_HEADER });
  }

  public loginPerson(person: Person): Observable<HttpResponse<Person>>  {
    const url = `${HOST}/api/person/do-login?username=${person.userName}&password=${encodeURIComponent(person.password)}`;

    return this.httpClient.post<Person>(url, {}, { observe: 'response' });
  }

  public getPersons(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(`${HOST}/api/person/all`);
  }

  public checkUsernameAvailability(username: string): Observable<object> {
    return this.httpClient.post(`${HOST}/api/person/checkUserNameAvailability/${username}`, {});
  }

  public confirmEmail(token: string): Observable<ResponseEntity> {
    return this.httpClient.get<ResponseEntity>(`${HOST}/api/person/confirmEmail?token=${token}`);
  }

  public registerPerson(person: Person): Observable<Person> {
    return this.httpClient.post<Person>(`${HOST}/api/person/register`, person);
  }

  public getCurrentPerson(): Observable<Person> {
    return this.httpClient.get<Person>(`${HOST}/api/person/`);
  }

  public savePerson(person: Person): Observable<Person> {
    return this.httpClient.put<Person>(`${HOST}/api/person/`, person);
  }

  public getProposalsToImplement(): Observable<Offer[]> {
    return this.httpClient.get<Offer[]>(`${HOST}/api/person/offer`);
  }

  public addProposal(offer: Offer): Observable<Offer[]> {
    return this.httpClient.post<Offer[]>(`${HOST}/api/person/offer?message=${offer.message}&anonymousPost=${offer.anonymousPost}`, {});
  }

  public updateProposal(offer: Offer): Observable<Offer[]> {
    return this.httpClient.put<Offer[]>(`${HOST}/api/person/offer/${offer.id}/?message=${offer.message}&anonymousPost=${offer.anonymousPost}`, {});
  }

  public deleteProposal(offerId: number): Observable<Offer[]> {
    return this.httpClient.delete<Offer[]>(`${HOST}/api/person/offer/${offerId}`);
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

