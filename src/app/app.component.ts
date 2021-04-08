import { Component, OnInit } from '@angular/core';
import { RestaurantService } from './restaurant.service';
import { MemberService } from './member.service';
import { ReviewService } from './review.service';
import { Restaurant } from './restaurant';
import { Member } from './member';
import { Review } from './review';
import { NgForm, NgModel } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit 
{
  // public restaurants: Restaurant[] = [];
  // public reviews: Review[] = [];
  // public members: Member[] = [];
  public reviewsFromMember: Review[] = [];
  public acceptedPassword = true;

  constructor(public restaurantService: RestaurantService, public reviewService: ReviewService, public memberService: MemberService){}

  ngOnInit() {
    this.getRestaurants();
    this.getReviews();
    this.getMembers();
  }

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

     this.memberService.members.push(guest);
  }


    // Method used to create an array that will simple assist *ngFor as a counter to display an icon 
  // a number of times (reps times)
  public countArray(reps: number){
    return Array(Math.floor(reps));
  }


  // Method that finds all reviews by a member and inserts them into a list that is reset
  // every time we query for all of this member's reviews.
  public setReviewsFromMember(): void {
    this.reviewsFromMember = [];   // First we clear result list of reviews

    for (let review of this.reviewService.reviews)   // And now we form the list of reviews with restaurantId provided
      if (review.memberId === this.memberService.loggedInMember.id)
        this.reviewsFromMember.push(review);
  }


  // Method that counts and returns number of reviews by one member
  public getReviewsFromMemberCount(): number {
    this.setReviewsFromMember();  
    return this.reviewsFromMember.length;
  }


  // Method to assist on displaying the whole member's address in one string
  public getMemberLocation(memberId: string): string{
    let targetMember: Member = this.memberService.members.find( ({ id }) => id === memberId ) as Member;
    return `${targetMember.locCity}, ${targetMember.locState} ${targetMember.locZipCode}`;
  }


  public getRestaurantLocation(restaurantId: number): string{
    let targetRestaurant = this.restaurantService.restaurants.find( ({ id }) => id === restaurantId ) as Restaurant;
    return `${targetRestaurant.locCity}, ${targetRestaurant.locState} ${targetRestaurant.locZipCode}`;
  }


  public getRestaurantName(restaurantId: number): string{
    let targetRestaurant = this.restaurantService.restaurants.find( ({ id }) => id === restaurantId ) as Restaurant;
    return targetRestaurant.name;
  }


  public getShortBirthdate(memberId: string): string{
    let shortDate: string = "";
    let targetMember: Member = this.memberService.members.find( ({ id }) => id === memberId ) as Member;
  
    shortDate = targetMember.birthDate.slice(0,15);
    if (shortDate[14] == ',')
      shortDate = shortDate.slice(0,14);

    return shortDate;
  }


  public onLogin(loginForm: NgForm): void{
    let user = loginForm.value.username as string;
    let pass = loginForm.value.password as string;
    const closeButton = document.getElementById('loginCloseButton');

    let targetUser = this.memberService.members.find( ({ id}) => (id === user) ) as Member;

    if (targetUser)
    {
      if (targetUser.password === pass)
      {
        this.memberService.loggedInMember = targetUser;
        this.acceptedPassword = true;
        loginForm.reset();
        closeButton?.click();       // clicing close button to close form after 
      }                             // successful submission of data
      else
          this.acceptedPassword = false;

      loginForm.reset();
      // closeButton?.click();
    }
  }

  public onAddMember(addMemberForm: NgForm): void{
    let username = addMemberForm.value.username as string;
    const closeButton = document.getElementById('addMemberCloseButton');

    let targetUser = this.memberService.members.find( ({id}) => (id === username) ) as Member;

    if (!targetUser) {      // if there is no member with that username yet...

      let newMember = {
        id: addMemberForm.value.username,
        password: addMemberForm.value.password,
        firstName: addMemberForm.value.firstName,
        lastName: addMemberForm.value.lastName,
        birthDate: new Date(addMemberForm.value.birthDate).toString(),
        locCity: addMemberForm.value.locCity,
        locState: addMemberForm.value.locState,
        locZipCode: addMemberForm.value.locZipCode,
        gender: addMemberForm.value.gender,
        email: addMemberForm.value.email
      }
  
      this.memberService.addMember(newMember).subscribe( 
        (response: Member) => { 
          this.memberService.members.push(response);
          this.memberService.loggedInMember = this.memberService.members.find( ({id}) => (id === newMember.id) ) as Member;
          this.acceptedPassword = true;
          addMemberForm.reset();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
  
      closeButton?.click();
    }                             
    else {
      this.acceptedPassword = false;
    }

  }


  public onLogout(): void{
     this.memberService.loggedInMember = this.memberService.members.find( ({ id }) => id === "Guest" ) as Member;
  }


  public onOpenModal(mode: string): void {
    const container = document.getElementById('mainContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'myProfile') {
      button.setAttribute('data-target', '#myProfileModal');
    }
    if (mode === 'myReviews') {
      this.setReviewsFromMember(); // re-sets the reviewsByRestaurant
      button.setAttribute('data-target', '#myReviewsModal');
    }
    if (mode === 'logIn') {
      button.setAttribute('data-target', '#logInModal');
    }
    if (mode === 'addMember') {
      button.setAttribute('data-target', '#addMemberModal');
    }

    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }

  
}
