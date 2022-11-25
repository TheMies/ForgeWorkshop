import { Component, OnInit } from '@angular/core';
import { Bim360Item } from './definitions';
import { Bim360ItemsService } from './bim360-items.service';
import { Bim360Service } from './bim360.service';

@Component({
  selector: 'daqs-bim360',
  templateUrl: './bim360.component.html',
  styleUrls: ['./bim360.component.css']
})
export class Bim360Component implements OnInit {
  public selectedItem: Bim360Item | undefined;
  public items: Bim360Item[] = [];
  public renderViewer = false;
  public selectedItemId = "";

  constructor(
    private bimService: Bim360Service,
    private bim360ItemsService: Bim360ItemsService) { }


  public viewOptions = {
    env: 'AutodeskProduction2',
    getAccessToken: (onGetAccessToken: (token: string, expire: number) => void) => {
      if (this.bimService.accessToken?.access_token) {
        onGetAccessToken(this.bimService.accessToken?.access_token, this.bimService.accessToken?.expires_in);
      }
    },
    api: 'streamingV2',
  }

  public ngOnInit(): void {
    // Check is we have a token
    if (this.bimService.accessToken === undefined || this.bimService.accessToken.access_token === "") {
      // Try to get from storage
      let at = localStorage.getItem('accessToken');
      if (at === null) {
        this.bimService.getCode();
      }
      else {
        this.bimService.accessToken = JSON.parse(at);
        this.loadHubs();
      }
    }
    else {
      console.info("You already have a token!...");
      this.loadHubs();
    }
  }

  public onItemSelected(id: string): void {
    this.selectedItem = this.bim360ItemsService.allItems.find(i => i.id === id);
    if (!this.selectedItem) {
      return;
    }

    this.renderViewer = false;
    this.selectedItemId = "";

    switch (this.selectedItem.type) {
      case "hubs":
        this.bim360ItemsService.getProjects(this.selectedItem).subscribe(h => this.items = h);
        break;
      case "projects":
        this.bim360ItemsService.getProjectTopFolders(this.selectedItem).subscribe(h => this.items = h);
        break;
      case "topFolders":
        this.bim360ItemsService.getFolderContent(this.selectedItem).subscribe(h => this.items = h);
        break;
      case "folders":
        this.bim360ItemsService.getFolderContent(this.selectedItem).subscribe(h => this.items = h);
        break;
      case "items":
        this.selectedItemId = this.selectedItem.derivativeId;
        this.renderViewer = true;
        break;
    }
  }

  public onBackClick(): void {
    if (this.selectedItem) {
      if (this.selectedItem.type == "hubs") {
        this.loadHubs();
      }
      else {
        this.onItemSelected(this.selectedItem.parentId);
      }
    }
  }

  public loadHubs() {
    this.items = [];
    this.selectedItem = undefined;
    this.bim360ItemsService.getAllHubs()?.subscribe({
      next: hubs => this.items = hubs,
      error: (error) => {
        if (error?.status === 401) {
          this.bimService.getCode();
        } else {
          console.error('Oops, something went horribly wrong!!');
        }
      }
    });
  }
}

