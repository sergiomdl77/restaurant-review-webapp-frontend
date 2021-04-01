import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestaurantMainComponent } from './restaurant-main/restaurant-main.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberMainComponent } from './member-main/member-main.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantMainComponent,
    RestaurantListComponent,
    MemberListComponent,
    MemberMainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
