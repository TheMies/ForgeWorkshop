import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizedComponent } from './authorized/authorized.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgeViewerComponent } from './forge-viewer/forge-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizedComponent,
    ForgeViewerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
