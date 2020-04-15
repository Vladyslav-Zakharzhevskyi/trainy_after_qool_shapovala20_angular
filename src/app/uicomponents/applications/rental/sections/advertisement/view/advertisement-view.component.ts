import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../../../api/api.service';
import {Advertisement} from '../../../../../../_models/advertisement';

@Component({
  selector: 'advertisement-view',
  templateUrl: './advertisement-view.component.html',
  styleUrls: ['./advertisement-view.component.css'],
})
export class AdvertisementViewComponent implements OnInit {
  displayedColumns: string[] = ['title', 'dateCreation', 'type', 'description', 'cost', 'countRoom', 'floorNumber', 'openedForBargain'];
  dataSource: Advertisement[];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getAdvertisements().subscribe(data =>
        this.dataSource = data
    );
  }

}
