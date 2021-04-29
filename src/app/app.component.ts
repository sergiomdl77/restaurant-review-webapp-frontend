import { Component, OnInit } from '@angular/core';
import { RestaurantService } from './restaurant.service';
import { MemberService } from './member.service';
import { ReviewService } from './review.service';
import { Restaurant } from './restaurant';
import { Member } from './member';
import { Review } from './review';
import { NgForm, NgModel } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit 
{
  public reviewsFromMember: Review[] = [];
  public acceptedPassword = true;
  public reviewToDelete = {} as Review;

  constructor(public restaurantService: RestaurantService, public reviewService: ReviewService, public memberService: MemberService){}

  ngOnInit() {
    this.getRestaurants();
    this.getReviews();
    this.getMembersForInit();
  }

  public getRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe(
      (response: Restaurant[]) => {
        this.restaurantService.restaurants = response;
        this.restaurantService.restaurantSearchResults = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  // Method that sets property "reviews" with the complete list of reviews that are 
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


  // Method that sets injected memberService with the complete list of members that are 
  // currently persisted on the database at the moment of initializing the component
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


  // Method that sets injected memberService with the complete list of members that are 
  // currently persisted on the database at the moment of initializing the component. This
  // method also adds a "Guest" member to the list of members.
  public getMembersForInit(): void {
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


  // Method that resets the restaurant Results to all display all currently persisted restaurants
  public resetRestaurantResults(): void{
    this.restaurantService.restaurantSearchResults = this.restaurantService.restaurants;
  }


  // Method used to create an array that will simple assist *ngFor as a counter to display an icon 
  // a number of times (reps times)
  public countArray(reps: number){
    return Array(Math.floor(reps));
  }


  public getDate(birthDate: string){
    let fullDate =  new Date(birthDate);
    let shortDate = `${fullDate.getMonth()}/${fullDate.getDay()} / ${fullDate.getFullYear()}`;
    return shortDate;
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
        // this.acceptedPassword = true;
        loginForm.reset();
        closeButton?.click();       // clicing close button to close form after 
      }                             // successful submission of data
      else
          this.acceptedPassword = false;
    }
    else
      this.acceptedPassword = false;

    loginForm.reset();
  }

  public onAddMember(addMemberForm: NgForm): void{
    let username = addMemberForm.value.username as string;
    const closeButton = document.getElementById('signUpCloseButton');

    let targetUser = this.memberService.members.find( ({id}) => (id === username) ) as Member;

    if (!targetUser) {      // if there is no member with that username yet...

      let newMember = {
        id: addMemberForm.value.username.toLowerCase(),
        password: addMemberForm.value.password,
        firstName: addMemberForm.value.firstName,
        lastName: addMemberForm.value.lastName,
        birthDate: new Date(addMemberForm.value.birthDate).toString(),
        locCity: addMemberForm.value.locCity,
        locState: addMemberForm.value.locState.toUpperCase(),
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
    else 
      this.acceptedPassword = false;

  }

  public onUpdateMember(updateMemberForm: NgForm): void{
    const closeButton = document.getElementById('editProfileCloseButton');

    let editedMember = {
      id: updateMemberForm.value.editUsername,
      password: updateMemberForm.value.editPassword,
      firstName: updateMemberForm.value.editFirstName,
      lastName: updateMemberForm.value.editLastName,
      birthDate: new Date(updateMemberForm.value.editBirthDate).toString(),
      locCity: updateMemberForm.value.editLocCity,
      locState: updateMemberForm.value.editLocState.toUpperCase(),
      locZipCode: updateMemberForm.value.editLocZipCode,
      gender: updateMemberForm.value.editGender,
      email: updateMemberForm.value.editEmail
    }
  
    this.memberService.updateMember(editedMember).subscribe( 
      (response: Member) => { 
        let index = this.memberService.members.indexOf(this.memberService.loggedInMember,0);
        this.memberService.loggedInMember = editedMember;
        this.memberService.members.splice(index,1);
        this.memberService.members.push(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  
    closeButton?.click();
  }


  public deleteReview(review: Review): void{
    this.reviewService.deleteReview(review.rvId).subscribe( 
      (response: void) => { 
        let index = this.reviewService.reviews.indexOf(review,0);
        this.reviewService.reviews.splice(index,1);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }


  public deleteMemberReviews(member: Member): void{
    for (let review of this.reviewService.reviews)
      if (review.memberId === this.memberService.loggedInMember.id)
        this.deleteReview(review);
  }

  
  public onDeleteMember(): void{
    const closeButton = document.getElementById("closeAccountCloseButton");

    this.deleteMemberReviews(this.memberService.loggedInMember);
    this.getReviews();

    this.memberService.deleteMember(this.memberService.loggedInMember.id).subscribe( 
      (response: void) => { 
        let index = this.memberService.members.indexOf(this.memberService.loggedInMember,0);
        this.memberService.members.splice(index,1);
        this.onLogout();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )

    closeButton?.click();
  }


  public setupDeleteReview(review: Review): void{
    this.reviewToDelete = review;

    const container = document.getElementById('mainContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#deleteReviewModal');
    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }

  public onDeleteReview(): void{
    const closeButton = document.getElementById("deleteReviewCloseButton");

    this.reviewService.deleteReview(this.reviewToDelete.rvId).subscribe( 
      (response: void) => { 
        this.getReviews();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )

    closeButton?.click();

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
      this.acceptedPassword = true;
      button.setAttribute('data-target', '#logInModal');
    }
    if (mode === 'signUp') {
      button.setAttribute('data-target', '#signUpModal');
    }
    if (mode === 'editProfile') {
      button.setAttribute('data-target', '#editProfileModal');
    }
    if (mode === 'closeAccount') {
      button.setAttribute('data-target', '#closeAccountModal');
    }

    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }

  
}
