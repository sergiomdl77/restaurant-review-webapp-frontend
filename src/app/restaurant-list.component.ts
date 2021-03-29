import { Component, OnInit } from '@angular/core';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant';
import { ReviewService } from './review.service';
import { Review } from './review';
import { MemberService } from './member.service';
import { Member } from './member';
import { HttpErrorResponse } from '@angular/common/http';

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
  public restaurantByName: string = "";    
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

/*
  public getMemberLocation(memberId: string): string{
    let location = "Here";
    this.memberService.getMember(memberId).subscribe(
      (response: Member) => {
         location = `${response.locCity}, ${response.locState} ${response.locZipCode}`;

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  
    return location;
  }
*/

public getMemberLocation(memberId: string): string{
  let location: string;
  let targetMember = this.members.find( ({ id }) => id === memberId ) as Member;

  location = `${targetMember.locCity}, ${targetMember.locState} ${targetMember.locZipCode}`;

  return location;
}


  // Method that sets property "reviewsByRestaurantId" with the list of restaurants that 
  // are currently persisted on the database and match the restaurantId provided.  This
  // method should be called every time 
  public getReviewsOnRestaurant(restaurant: Restaurant): void {
    this.reviewsOnRestaurant = [];   // First we clear result list of reviews
    this.restaurantByName = restaurant.name;

    for (let review of this.reviews)   // And now we form the list of reviews with restaurantId provided
      if (review.restaurantId === restaurant.id)
        this.reviewsOnRestaurant.push(review);
  }


  //Method in charge of directing the action of a button to the regular Modal (pop-up window)
  //In this component's template there are two buttons to open two different modals. This is 
  //accomplished by creating virtual/invisible button that will be setup with the appropriate 
  //attributes according to the "mode" parameter. Then it will setup ceertain componenet's 
  //properties in order to make their values accessible for modal's display. Finally this 
  //button triggers its own (click) event which will result in opening thei desired modal.
  public onOpenModal(restaurant: Restaurant, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'reviewList') {
      this.getReviewsOnRestaurant(restaurant); // re-sets the reviewsByRestaurant
      button.setAttribute('data-target', '#reviewsOnRestaurantModal');
    }
    if (mode === 'addReview') {
      button.setAttribute('data-target', '#addReviewModal');
    }
    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }
}
