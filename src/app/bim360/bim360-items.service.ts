import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Bim360Item } from './definitions';
import { Bim360Service } from './bim360.service';

@Injectable({
  providedIn: 'root'
})
export class Bim360ItemsService {
  public allItems: Bim360Item[] = [];

  constructor(private bimService: Bim360Service) { }

  public getAllHubs() {
    // ! Implement
  }
}
