import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bim360Service } from '../bim360/bim360.service';

@Component({
  selector: 'daqs-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.css']
})
export class AuthorizedComponent implements OnInit {
  public message = "";

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private bimService: Bim360Service) { }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      const code = p["code"];
      if (code) {
        this.getAccessToken(code);
      } else {
        this.message = 'Authentication failed!';
      }
    });
  }

  public getAccessToken(code: string): void {
    this.bimService.getAccessToken(code).subscribe(d => {
      this.bimService.accessToken = d;
      localStorage.setItem('accessToken', JSON.stringify(d));
      this.router.navigate(["/"]);
    });
  }
}

