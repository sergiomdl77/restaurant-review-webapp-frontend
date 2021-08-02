import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common'; 

import { AppComponent } from './app.component';
import { RestaurantMainComponent } from './restaurant-main/restaurant-main.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberMainComponent } from './member-main/member-main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantMainComponent,
    RestaurantListComponent,
    MemberListComponent,
    MemberMainComponent,
    PageNotFoundComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
