import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Review } from './review';
import { environment } from 'src/environments/environment';

// Service that sends the proper requests to the Backend's 
// reviewService, in order to receive the necessary data 
// from the Review entity in the Database.

@Injectable({
    providedIn:  'root'
})

export class ReviewService
{
    private apiServerUrl = environment.apiBaseUrl;
    public reviews: Review[] = []; 

    // Injecting the built in HttpClient to make http requests to backend
    constructor(private http: HttpClient) {}
     
    public getAllReviews(): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiServerUrl}/api/review/find/all`)
    }

    public getReview(reviewId: number): Observable<Review> {
        return this.http.get<Review>(`${this.apiServerUrl}/api/review/find/${reviewId}`)
    }

    public addReview(review: Review): Observable<Review> {
        return this.http.post<Review>(`${this.apiServerUrl}/api/review/add`, review)
    }    
        
    public updateReview(review: Review): Observable<Review> {
        return this.http.put<Review>(`${this.apiServerUrl}/api/review/update`, review)
    }  
    
    public deleteReview(reviewId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/review/delete/${reviewId}`)
    }    
    
}
