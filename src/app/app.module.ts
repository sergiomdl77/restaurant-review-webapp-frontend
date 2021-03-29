import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestaurantMainComponent } from './restaurant-main.component';
import { RestaurantListComponent } from './restaurant-list.component';

@NgModule({
  declarations: [
    AppComponent,
    RestaurantMainComponent,
    RestaurantListComponent
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
