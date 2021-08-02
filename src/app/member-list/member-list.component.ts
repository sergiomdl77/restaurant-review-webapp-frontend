import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Member } from '../member';
import { MemberService } from '../member.service';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';
import { Review } from '../review';
import { ReviewService } from '../review.service';

@Component({
  selector: 'member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent 
{
  public reviewsFromMember: Review[] = [];
  public memberOfInterest: Member = {} as Member;
  public restaurantOfInterest: Restaurant = {
    id: 0,
    name: "",
    phoneNumber: "",
    email: "",
    locCity: "",
    locState: "",
    locZipCode: "",
    avgScore: 0,
    reviewCount: 0,
    foodType: "",
    ambiance: "",
    priceLevel: 0,
    imageUrl: "",
    description: ""
  }

  constructor(public restaurantService: RestaurantService, public reviewService: ReviewService, public memberService: MemberService){}


  public setRestaurantOfInterest(restaurantId:number): void{
    this.restaurantService.getRestaurant(restaurantId).subscribe(
      (response: Restaurant) => { 
        this.restaurantOfInterest = response;
      },
      (error: HttpErrorResponse) => { alert(error.message); }
    );
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


  public getReviewsFromMemberCount(member: Member): number {
    return this.reviewsFromMember.length;
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
  
    shortDate = targetMember.birthDate.slice(0,15);
    if (shortDate[14] == ',')
      shortDate = shortDate.slice(0,14);

    return shortDate;
  }

  public getRestaurantLocation(restaurantId: number): string{
    let location: string;
    let targetRestaurant = this.restaurantService.restaurants.find( ({ id }) => id === restaurantId ) as Restaurant;
  
    location = `${targetRestaurant.locCity}, ${targetRestaurant.locState} ${targetRestaurant.locZipCode}`;
  
    return location;
  }


  public getRestaurantName(restaurantId: number): string{
    let restaurantName: string;
    let targetRestaurant = this.restaurantService.restaurants.find( ({ id }) => id === restaurantId ) as Restaurant;
  
    restaurantName = targetRestaurant.name;
  
    return restaurantName;
  }

  public getRestaurantImageUrl(restaurantId: number): string{
    let restaurantImageUrl: string;
    let targetRestaurant = this.restaurantService.restaurants.find( ({ id }) => id === restaurantId ) as Restaurant;
  
    restaurantImageUrl = targetRestaurant.imageUrl;
  
    return restaurantImageUrl;
  }


  public setReviewsFromMember(member: Member): void {
    this.reviewsFromMember = [];   // First we clear result list of reviews
    this.memberOfInterest = member;

    for (let review of this.reviewService.reviews)   // And now we form the list of reviews with restaurantId provided
    { 
      if (review.memberId === member.id)
        this.reviewsFromMember.push(review);
    }
  }


  public countReviesFromMember(member: Member): number {
    let count = 0;

    for (let review of this.reviewService.reviews)   // And now we form the list of reviews with restaurantId provided
      if (review.memberId === member.id)
        count++;
        
    return count;
  }



  public onOpenModal(member: Member, mode: string): void {
    const container = document.getElementById('memberListContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'reviewList') {
      this.setReviewsFromMember(member); // re-sets the reviewsFromMember
      button.setAttribute('data-target', '#reviewsFromMemberModal');
    }

    container?.appendChild(button);    // added "?" because container could be null and this project is on "strict mode"
    button.click();
  }

}
