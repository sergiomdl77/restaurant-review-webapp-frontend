import { Component, OnInit } from '@angular/core';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant';
import { HttpErrorResponse } from '@angular/common/http';
import { Member } from './member';
import { Review } from './review';
import { MemberService } from './member.service';
import { ReviewService } from './review.service';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit 
{
  public restaurants: Restaurant[] = [];
  public reviews: Review[] = [];
  public members: Member[] = [];
  public loggedInMember: Member = {} as Member;
  public reviewsFromMember: Review[] = [];
  public acceptedPassword = true;

  constructor(private restaurantService: RestaurantService, private reviewService: ReviewService, private memberService: MemberService){}

  ngOnInit() {
    this.getRestaurants();
    this.getReviews();
    this.getMembers();
  }

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
          this.addGuestUser();        // Adding mock user to use when nobody has logged in
          this.onLogout();            // Initializing the loggedInMember to "Guest User"
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private addGuestUser(): void {
    let guest: Member = {
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
     } 

     this.members.push(guest);
  }


  public onLogin(loginForm: NgForm): void{
    let user = loginForm.value.username as string;
    let pass = loginForm.value.password as string;
    const closeButton = document.getElementById('closeButton');

    let targetUser = this.members.find( ({ id}) => (id === user) ) as Member;

    if (targetUser)
      if (targetUser.password === pass)
      {
        this.loggedInMember = targetUser;
        this.acceptedPassword = true;
        closeButton?.click();       // clicing close button to close form after 
      }                             // successful submission of data
      else
          this.acceptedPassword = false;
  }

  public onLogout(): void{
     this.loggedInMember = this.members.find( ({ id }) => id === "Guest" ) as Member;
  }


  // Method that finds all reviews by a member and inserts them into a list that is reset
  // every time we query for all of this member's reviews.
  public setReviewsFromMember(member: Member): void {
    this.reviewsFromMember = [];   // First we clear result list of reviews

    for (let review of this.reviews)   // And now we form the list of reviews with restaurantId provided
      if (review.memberId === member.id)
        this.reviewsFromMember.push(review);
  }

  // Method that counts and returns number of reviews by one member
  public getReviewsFromMemberCount(member: Member): number {
    this.setReviewsFromMember(member);  
    return this.reviewsFromMember.length;
  }


  // Method to assist on displaying the whole member's address in one string
  public getMemberLocation(memberId: string): string{
    let location: string;
    let targetMember: Member = this.members.find( ({ id }) => id === memberId ) as Member;
  
    location = `${targetMember.locCity}, ${targetMember.locState} ${targetMember.locZipCode}`;
  
    return location;
  }



  public onOpenModal(mode: string): void {
    const container = document.getElementById('mainContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'viewProfile') {
      button.setAttribute('data-target', '#viewProfileModal');
    }
    if (mode === 'logIn') {
      button.setAttribute('data-target', '#logInModal');
    }

    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }

  
}
