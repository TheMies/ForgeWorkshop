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

  public getAllHubs(): Observable<Bim360Item[]> {
    return new Observable((subscriber) => {
      if (!this.getFromCache(subscriber, "")) {
        // Load from BIM360
        this.bimService.getHubs().subscribe({
          next: hubs => {
            this.allItems = hubs;
            subscriber.next(hubs);
            subscriber.complete();
          },
          error: (error) => {
            subscriber.error(error);
            subscriber.complete();
          },
        });
      }
    });
  }

  public getProjects(hub: Bim360Item): Observable<Bim360Item[]> {
    return new Observable((subscriber) => {
      if (!this.getFromCache(subscriber, hub.id)) {

        // Load from BIM360
        this.bimService.getProjects(hub).subscribe(projects => {
          this.allItems.push(...projects);
          subscriber.next(projects);
          subscriber.complete();
        });
      }
    });
  }

  public getProjectTopFolders(project: Bim360Item): Observable<Bim360Item[]> {
    return new Observable((subscriber) => {
      if (!this.getFromCache(subscriber, project.id)) {

        // Load from BIM360
        this.bimService.getProjectTopFolders(project).subscribe(folders => {
          this.allItems.push(...folders);
          subscriber.next(folders);
          subscriber.complete();
        });
      }
    });
  }

  public getFolderContent(folder: Bim360Item): Observable<Bim360Item[]> {
    return new Observable((subscriber) => {
      if (!this.getFromCache(subscriber, folder.id)) {

        // Load from BIM360
        this.bimService.getFolderContent(folder).subscribe(contents => {
          this.allItems.push(...contents);
          subscriber.next(contents);
          subscriber.complete();
        });
      }
    });
  }

  private getFromCache(subscriber: Subscriber<Bim360Item[]>, parentId: string): boolean {
    let items = this.allItems.filter(i => i.parentId == parentId);
    if (items.length > 0) {
      subscriber.next(items);
      subscriber.complete();
    }

    return items.length > 0;
  }
}
