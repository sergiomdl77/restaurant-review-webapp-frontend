import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from './restaurant';
import { environment } from 'src/environments/environment';

// Service that sends the proper requests to the Backend's 
// restaurantService, in order to receive the necessary data 
// from the Restaurant entity in the Database.

@Injectable({
    providedIn:  'root'
})
export class RestaurantService
{
    private apiServerUrl = environment.apiBaseUrl;
    public restaurants: Restaurant[] = [];

    // Injecting the built in HttpClient to make http requests to backend
    constructor(private http: HttpClient) {}
     
    public getAllRestaurants(): Observable<Restaurant[]> {
        return this.http.get<Restaurant[]>(`${this.apiServerUrl}/api/restaurant/find/all`)
    }

    public getRestaurant(restaurantId: number): Observable<Restaurant> {
        return this.http.get<Restaurant>(`${this.apiServerUrl}/api/restaurant/find/${restaurantId}`)
    }

    public addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
        return this.http.post<Restaurant>(`${this.apiServerUrl}/api/restaurant/add`, restaurant)
    }    
        
    public updateRestaurant(restaurant: Restaurant): Observable<Restaurant> {
        return this.http.put<Restaurant>(`${this.apiServerUrl}/api/restaurant/update`, restaurant)
    }  
    
    public deleteRestaurant(restaurantId: Restaurant): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/restaurant/delete/${restaurantId}`)
    }    
    
}
