import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AccessToken, Bim360Item } from "./definitions";

@Injectable({
  providedIn: 'root'
})
export class Bim360Service {
  private autodeskCodeUrl: string = "https://developer.api.autodesk.com/authentication/v2/authorize";
  private clientId: string = "TODO";
  private clientSecret: string = "TODO";

  private returnUrl: string= "http://localhost:4200/oauth/";
  private responseType: string ="code";
  private scope:string = "data:read viewables:read";

  private autodeskTokenUrl: string = "https://developer.api.autodesk.com/authentication/v2/token";

  public accessToken: AccessToken | undefined;

  constructor(private http: HttpClient) {   }

  public getCode(){
    // Just redirect to: https://developer.api.autodesk.com/authentication/v2/authorize?response_type=code&client_id=[CLIENTID]]&redirect_uri=[CALLBACKURL]]&scope=data:read"
    window.location.href = `${this.autodeskCodeUrl}?response_type=${this.responseType}&client_id=${this.clientId}&redirect_uri=${this.returnUrl}&scope=${this.scope}`;
  }

  public getAccessToken(code: string): Observable<any>{
    // curl -v 'https://developer.api.autodesk.com/authentication/v2/token'
    // -X 'POST'
    // -H 'Content-Type: application/x-www-form-urlencoded''
    // -H 'accept: application/json' \'
    // -d 'grant_type=authorization_code'
    // -d 'client_id=obQDn8P0GanGFQha4ngKKVWcxwyvFAGE'
    // -d 'code_verifier=Gc5iVXpKU3puUjXaYWg3T1NCTDQtcQ1ROUY*YXlwalNot0hhakxifaZWag'
    // -d 'code=wroM1vFA4E-Aj241-quh_LVjm7UldawnNgYEHQ8I'
    // -d 'redirect_uri=http://sampleapp.com/oauth/callback'
    // -d 'scope=data:read'    
    const body = "";
    // const params = new HttpParams()
    //   .set('grant_type', 'authorization_code')
    //   .set('code', code)
    //   .set('redirect_uri', encodeURI(this.returnUrl))
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencode',
        'accept': 'application/json',
        'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
      }),
      params: new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', code)
        .set('redirect_uri', encodeURI(this.returnUrl)),
    };
    return this.http.post<any>(this.autodeskTokenUrl, body, httpOptions);
  }

  private getAutorizationHeader() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencode',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken?.access_token,
      })};
  }

  public getHubs(): Observable<Bim360Item[]> {
      return this.http.get<any>("https://developer.api.autodesk.com/project/v1/hubs", this.getAutorizationHeader()).pipe(
        map(hubs => hubs.data.map((hub:any) => ({
            id: hub.id,
            type: hub.type,
            name: hub.attributes.name,
            parentId: "",
          })
      )));
  }

  public getProjects(item: Bim360Item) : Observable<Bim360Item[]>{
      return this.http.get<any>(`https://developer.api.autodesk.com/project/v1/hubs/${item.id}/projects`, this.getAutorizationHeader()).pipe(
        map(hubs => hubs.data.map((project:any) => ({
            id: project.id,
            type: project.type,
            name: project.attributes.name,
            parentId: item.id,
            hubId: item.id,
            parent: item,
          })
      )));
  }

  public getProjectTopFolders(item: Bim360Item): Observable<Bim360Item[]> {
      return this.http.get<any>(`https://developer.api.autodesk.com/project/v1/hubs/${item.hubId}/projects/${item.id}/topFolders`, this.getAutorizationHeader()).pipe(
        map(hubs => hubs.data.map((topFolder:any) => ({
            id: topFolder.id,
            type: "topFolders",
            name: topFolder.attributes.name,
            parentId: item.id,
            hubId: item.hubId,
            projectId: item.id,
            parent: item,
          })
      )));
  }

  public getFolderContent(item: Bim360Item): Observable<Bim360Item[]> {
    // Get (Sub)Folders and Content
    return this.http.get<any>(`https://developer.api.autodesk.com/data/v1/projects/${item.projectId}/folders/${item.id}/contents`, this.getAutorizationHeader()).pipe(
      map(folderContent => folderContent.data.map((content:any, index:number) => {
        if (content.type == "folders"){
          return {
            id: content.id,
            type: content.type,
            name: `[F] ${content.attributes.name}`,
            parentId: item.id,
            projectId: item.projectId,
            parent: item,
          }
        }
        else {
          return {
            id: content.id,
            type: content.type,
            name: `[I] ${content.attributes.displayName}`,
            parentId: item.id,
            projectId: item.projectId,
            parent: item,
            derivativeId: folderContent.included.find((x: any) => x.relationships.item.data.id.startsWith(content.id))?.relationships.derivatives.data.id,
          }
        }
      }
  )));
  }
}
