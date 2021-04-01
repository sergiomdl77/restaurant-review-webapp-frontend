import { Component, OnInit } from '@angular/core';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant';
import { HttpErrorResponse } from '@angular/common/http';
import { Member } from './member';
import { Review } from './review';
import { MemberService } from './member.service';
import { ReviewService } from './review.service';

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
  public signedInMember: Member = {} as Member;
  public reviewsFromMember: Review[] = [];


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
        this.onLogin("lonelydinner1");        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

  }

  public onLogin(userName: string): void{
    let targetMember = this.members.find( ({ id }) => id === userName ) as Member;
    this.signedInMember = targetMember;
  }


  public setReviewsFromMember(member: Member): void {
    this.reviewsFromMember = [];   // First we clear result list of reviews

    for (let review of this.reviews)   // And now we form the list of reviews with restaurantId provided
      if (review.memberId === member.id)
        this.reviewsFromMember.push(review);
  }


  public getReviewsFromMemberCount(member: Member): number {
    this.setReviewsFromMember(member);  
    return this.reviewsFromMember.length;
  }

  public getMemberLocation(memberId: string): string{
    let location: string;
    let targetMember = this.members.find( ({ id }) => id === memberId ) as Member;
  
    location = `${targetMember.locCity}, ${targetMember.locState} ${targetMember.locZipCode}`;
  
    return location;
  }

  public onOpenModal(mode: string): void {
    const container = document.getElementById('mainContainer');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'login') {
      button.setAttribute('data-target', '#loginModal');
    }

    container?.appendChild(button);    // added "?" because container could be null and this code is on "strict mode"
    button.click();
  }

  
}
