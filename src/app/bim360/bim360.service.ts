import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  public getAccessToken(code: string) {
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
    // ! Implement
  }

  private getAutorizationHeader() {
    // ! Implement
  }

  public getHubs() {
    // ! Implement
  }
}
