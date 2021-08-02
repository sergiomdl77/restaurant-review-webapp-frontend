import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantMainComponent } from './restaurant-main/restaurant-main.component';
import { MemberMainComponent } from './member-main/member-main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  { path: 'restaurants', component: RestaurantMainComponent }, 
  { path: 'members', component: MemberMainComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
