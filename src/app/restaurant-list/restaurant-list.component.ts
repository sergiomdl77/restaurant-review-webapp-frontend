import { AppComponent } from './../app.component';
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

// export class RestaurantListComponent implements OnInit 
export class RestaurantListComponent 
{
  public restaurantOfInterest: Restaurant = {} as Restaurant; 
  public reviewsFromMemberOfInterest: Review[] = [];
  public reviewsOnRestaurantOfInterest: Review[] = [];
  public memberOfInterest: Member = {
    id : "Guest",
    password : "Guest",
    firstName : "Guest",
    lastName : "Guest",
    birthDate : "Guest",
    locCity : "Guest",
    locState : "Guest",
    locZipCode : "Guest",
    gender : "Guest",
    email : "Guest"
   };

  constructor(public restaurantService: RestaurantService, 
              public reviewService: ReviewService, 
              public memberService: MemberService,
              public appComponent: AppComponent){}



  public setMemberOfInterest(memberId:string): void{
    this.memberService.getMember(memberId).subscribe(
      (response: Member) => { 
        this.memberOfInterest = response;
        this.setReviewsFromMemberOfInterest();
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );
  }


  public setRestaurantOfInterest(restaurant: Restaurant): void {
    this.restaurantOfInterest = restaurant;
  }
  

  public getReviewsFromMemberOfInterestCount(): number {
    return this.reviewsFromMemberOfInterest.length;
  }

  public setReviewsFromMemberOfInterest(): void {
    this.reviewsFromMemberOfInterest = [];   // First we clear result list of reviews

    for (let review of this.reviewService.reviews)   // And now we form the list of reviews with restaurantId provided
    { 
      if (review.memberId === this.memberOfInterest.id)
        this.reviewsFromMemberOfInterest.push(review);
    }
  }


  public getMemberGender(memberId: string): string {
    let gender: string;
    let targetMember =  this.memberService.members.find( ({ id }) =>  memberId === id) as Member;
    gender = targetMember.gender;
    return gender;
  }


  public getMemberLocation(memberId: string): string{
    let location: string;
    let targetMember = this.memberService.members.find( ({ id }) => id === memberId ) as Member;
  
    location = `${targetMember.locCity}, ${targetMember.locState} ${targetMember.locZipCode}`;
  
    return location;
  }
  

  public getShortBirthdate(memberId: string): string{
    let shortDate: string = "";
    let targetMember: Member = this.memberService.members.find( ({ id }) => id === memberId ) as Member;
  
    shortDate = targetMember.birthDate;
    // shortDate = member.birthDate.slice(0,14);
    if (shortDate[14] == ',')
      shortDate = shortDate.slice(0,14);
    else
      shortDate = shortDate.slice(0,15);

    return shortDate;
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
        this.restaurantService.restaurants = response;
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
        this.reviewService.reviews = response;
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
        this.memberService.members = response;

      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


public getAvgScore(restaurantId: number): number{
  let scoreSum = 0;
  let count = 0;

  for (let review of this.reviewService.reviews)
    if (review.restaurantId === restaurantId)
    {
      scoreSum += review.score;
      count++;
    }

  if (count == 0)
    return 3;     // If there are no reviews yeat we simply assign 3 stars by default.
  else  
    return (Math.floor(scoreSum/count));
}

  // Method that sets property "reviewsByRestaurantId" with the list of restaurants that 
  // are currently persisted on the database and match the restaurantId provided.  This
  // method should be called every time we need to display a list of reviews for a specific
  // restaurant
  public setReviewsOnRestaurantOfInterest(restaurant: Restaurant): void {
    this.reviewsOnRestaurantOfInterest = [];   // First we clear result list of reviews
    this.restaurantOfInterest = restaurant;

    for (let review of this.reviewService.reviews)   // And now we form the list of reviews with restaurantId provided
      if (review.restaurantId === restaurant.id)
        this.reviewsOnRestaurantOfInterest.push(review);
  }


  public onAddReview(addReviewForm: NgForm): void{
    let theComment = addReviewForm.value.comment as string;
    let grade = addReviewForm.value.grade as number;
    const closeButton = document.getElementById('addReviewCloseButton');
    
    let newReview = {
      rvId: 10000,          // this value will be ignored by backend since it generates the rvId
      restaurantId: this.restaurantOfInterest.id,
      memberId: this.memberService.loggedInMember.id,
      rvDate: new Date().toString(),
      comment: theComment,
      score: grade    
    }

    this.reviewService.addReview(newReview).subscribe( 
      (response: Review) => { 
        this.getReviews();      // to reload all reviews (containing this addition)
      }
    )
    
    addReviewForm.reset();
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
      this.setReviewsOnRestaurantOfInterest(restaurant); // re-sets the reviewsByRestaurant
                                               // and sets restaurantOfInterest to a value
                                               // that refers to the restaurant that has the reviews
      button.setAttribute('data-target', '#reviewsOnRestaurantOfInterestModal');
    }
    if (mode === 'addReview') {
      if (this.memberService.loggedInMember.id != "Guest")
      {
        this.restaurantOfInterest = restaurant;
        button.setAttribute('data-target', '#addReviewModal');
      }
      else
        button.setAttribute('data-target', '#addReviewDeniedModal');

    }
    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }

}
