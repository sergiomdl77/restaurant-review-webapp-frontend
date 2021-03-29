import { Component, OnInit } from '@angular/core';
import { ReviewService } from './review.service';
import { Review } from './review';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})

export class ReviewListComponent implements OnInit 
{
  public reviews: Review[] = [];

  constructor(private reviewService: ReviewService){}

  ngOnInit() {
    this.getReviews();
  }

  public countArray(reps: number){
      return Array(Math.floor(reps));
  }

  public getReviews(): void {
    this.reviewService.getAllReviews().subscribe(
      (response: Review[]) => {
        this.reviews = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

/*
  public onOpenModal(review: Review, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'reviewList') {
      button.setAttribute('data-target', '#reviewListModal');
    }
    if (mode === 'addReview') {
      button.setAttribute('data-target', '#addReviewModal');
    }
    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }
*/
}
