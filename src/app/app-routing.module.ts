import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizedComponent } from './authorized/authorized.component';
import { Bim360Component } from './bim360/bim360.component';

const routes: Routes = [
  { path: "", component: Bim360Component },
  { path: "oauth", component: AuthorizedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
