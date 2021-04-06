import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../restaurant';
import { ReviewService } from '../review.service';
import { Review } from '../review';
import { MemberService } from '../member.service';
import { Member } from '../member';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})

export class RestaurantListComponent implements OnInit 
{
  public restaurants: Restaurant[] = [];
  public reviews: Review[] = [];
  public members: Member[] = [];
  public reviewsOnRestaurant: Review[] = [];
  public restaurantOfInterest: Restaurant = {} as Restaurant;    
  public memberOnReview = {} as Member;

  constructor(private restaurantService: RestaurantService, private reviewService: ReviewService, private memberService: MemberService){}

  //Setting up my all the necessary data from the database for its use in the component's template.
  ngOnInit() {
    this.getRestaurants();
    this.getReviews();
    this.getMembers();
  }


  // Method used to create an array that will simple assist *ngFor as a counter to display an icon 
  // a number of times (reps times)
  public countArray(reps: number){
      return Array(Math.floor(reps));
  }


  // Method that sets property "restaurants" with the complete list of restaurants that 
  // are currently persisted on the database
  public getRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe(
      (response: Restaurant[]) => {
        this.restaurants = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  // Method that sets property "reviews" with the complete list of restaurants that are 
  // currently persisted on the database
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


  // Method that sets property "members" with the complete list of restaurants that are 
  // currently persisted on the database
  public getMembers(): void {
    this.memberService.getAllMembers().subscribe(
      (response: Member[]) => {
        this.members = response;

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


public getMemberLocation(memberId: string): string{
  let location: string;
  let targetMember = this.members.find( ({ id }) => id === memberId ) as Member;

  location = `${targetMember.locCity}, ${targetMember.locState} ${targetMember.locZipCode}`;

  return location;
}


  // Method that sets property "reviewsByRestaurantId" with the list of restaurants that 
  // are currently persisted on the database and match the restaurantId provided.  This
  // method should be called every time we need to display a list of reviews for a specific
  // restaurant
  public setReviewsOnRestaurant(restaurant: Restaurant): void {
    this.reviewsOnRestaurant = [];   // First we clear result list of reviews
    this.restaurantOfInterest = restaurant;

    for (let review of this.reviews)   // And now we form the list of reviews with restaurantId provided
      if (review.restaurantId === restaurant.id)
        this.reviewsOnRestaurant.push(review);
  }


  public onAddReview(addReviewForm: NgForm): void{
    let theComment = addReviewForm.value.comment as string;
    let grade = addReviewForm.value.grade as number;
    const closeButton = document.getElementById('closeButton2');
    
    alert(new Date().toString());

    let newReview = {
      rvId: 10000,
      restaurantId: this.restaurantOfInterest.id,
      memberId: "picky_eater3",
      rvDate: new Date().toString(),
      comment: theComment,
      score: grade    
    }

    this.reviewService.addReview(newReview).subscribe( 
      (response: Review) => { 
        console.log(response);
        this.getReviews();      // to reload all reviews (containing this addition)
      }
    )
    
    closeButton?.click();       // clicing close button to close form after 
  }


  //Method in charge of directing the action of a button to the regular Modal (pop-up window)
  //In this component's template there are two buttons to open two different modals. This is 
  //accomplished by creating virtual/invisible button that will be setup with the appropriate 
  //attributes according to the "mode" parameter. Then it will setup ceertain componenet's 
  //properties in order to make their values accessible for modal's display. Finally this 
  //button triggers its own (click) event which will result in opening thei desired modal.
  public onOpenModal(restaurant: Restaurant, mode: string): void {
    const container = document.getElementById('restaurantListContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'reviewList') {
      this.setReviewsOnRestaurant(restaurant); // re-sets the reviewsByRestaurant
                                               // and sets restaurantOfInterest to a value
                                               // that refers to the restaurant that has the reviews
      button.setAttribute('data-target', '#reviewsOnRestaurantModal');
    }
    if (mode === 'addReview') {
      this.restaurantOfInterest = restaurant;
      button.setAttribute('data-target', '#addReviewModal');
    }
    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }
}
