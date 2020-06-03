import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Person } from '../../_models/person';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {

  public persons: Person[];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPersons().subscribe((data) => {
      this.persons = data;
    });
  }

}
