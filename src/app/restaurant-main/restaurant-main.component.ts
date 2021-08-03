import { Component } from '@angular/core';

import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../restaurant';
import { ReviewService } from '../review.service';
import { Review } from '../review';
import { MemberService } from '../member.service';
import { Member } from '../member';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'restaurant-main',
  templateUrl: './restaurant-main.component.html',
  styleUrls: ['./restaurant-main.component.css']
})

export class RestaurantMainComponent
{
  public restaurantResultsOrderCriteria: string = "";
  

  constructor(public restaurantService: RestaurantService, public reviewService: ReviewService, public memberService: MemberService){}


  // Method used to create an array that will simple assist *ngFor as a counter to display an icon 
  // a number of times (reps times)
  public countArray(reps: number){
    return Array(Math.floor(reps));
  }


  public orderRestaurantResultsByName(): void {
    this.restaurantService.restaurantSearchResults.sort( 
      (a: Restaurant, b: Restaurant) => ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1))
    );
  }

  public orderRestaurantResultsByPrice(): void{
    this.restaurantService.restaurantSearchResults.sort( 
      (a: Restaurant, b: Restaurant) => ((a.priceLevel < b.priceLevel) ? -1 : ((a.priceLevel == b.priceLevel) ? 0 : 1))
    );
  }

  public orderRestaurantResults(orderCriteria: string): void {
    if (orderCriteria === "Name") 
      this.restaurantService.restaurantSearchResults.sort( 
        (a: Restaurant, b: Restaurant) => ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1))
      );
    else if (orderCriteria === "Price") 
      this.restaurantService.restaurantSearchResults.sort( 
        (a: Restaurant, b: Restaurant) => ((a.priceLevel < b.priceLevel) ? -1 : ((a.priceLevel == b.priceLevel) ? 0 : 1))
      );

    this.restaurantResultsOrderCriteria = orderCriteria;
  
  }



  public getRating(restaurantId: number): number{
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
  
  
  // If there was at least one Price filter selected, this method will modify the list of restaurant search results
  // (which is a property of the restaurantService to be available to several components) to then be inspected by
  // the next filter.
  public filterByPrice(low: number, medium:number, high: number): void{
    let initialUnfilteredResults = this.restaurantService.restaurantSearchResults; // creating a copy of current results
                                                                                   // to filter down if filters selected
    // if at least one price filter was selected
    if (low !== 0 || medium !== 0 || high !== 0){
      this.restaurantService.restaurantSearchResults = [];  // cleans list of results to re-build it from scratch
                                                          
      for (let restaurant of initialUnfilteredResults)      // traverses through current results (not filtered by price yet)
      {
        if (restaurant.priceLevel === low || restaurant.priceLevel === medium || restaurant.priceLevel === high )
          this.restaurantService.restaurantSearchResults.push(restaurant);  // if one restaurant from current results
      }                                                                     // meets filter criteria, it is added to 
    }                                                                       // new list of results being built.
    // else, the list of current results is untouched.
  }


  // If there was at least one Rating filter selected, this method will modify the list of restaurant search results
  // (which is a property of the restaurantService to be available to several components) to then be inspected by
  // the next filter.
  public filterByRating(oneStar:number, twoStars:number, threeStars:number, fourStars:number, fiveStars:number): void{
    let priceFilterResults = this.restaurantService.restaurantSearchResults;   // creating a copy of current results
                                                                               // to filter down if filters selected
    // if at least one rating filter was selected
    if (oneStar !== 0 || twoStars !== 0 || threeStars !== 0 || fourStars !== 0 || fiveStars !== 0){
      this.restaurantService.restaurantSearchResults = [];  // cleans list of results to re-build it from scratch

      for (let restaurant of priceFilterResults)  // traverses through current results (not filtered by Rating yet)
      {
        if (this.getRating(restaurant.id) === oneStar || this.getRating(restaurant.id) === twoStars 
            || this.getRating(restaurant.id) === threeStars || this.getRating(restaurant.id) === fourStars
            || this.getRating(restaurant.id) === fiveStars)
          this.restaurantService.restaurantSearchResults.push(restaurant);  // if one restaurant from current results
      }                                                                     // meets filter criteria, it is added to
    }                                                                       // new list of results being built.
  }


  // If there was at least one Ambiance filter selected, this method will modify the list of restaurant search results
  // (which is a property of the restaurantService to be available to several components) to then be inspected by
  // the next filter.
  public filterByAmbiance(casual:string, semiCasual:string, formal:string): void{
    let ratingFilterResults = this.restaurantService.restaurantSearchResults;
    if (casual !== "" || semiCasual !== "" || formal !== "")  // if at least one ambiance filter was selected
    {
      this.restaurantService.restaurantSearchResults = [];
      for (let restaurant of ratingFilterResults)
      {
        if (restaurant.ambiance === casual || restaurant.ambiance === semiCasual || restaurant.ambiance === formal) 
          this.restaurantService.restaurantSearchResults.push(restaurant);
      }
    }
  }


  // If there was at least one Cuisine filter selected, this method will modify the list of restaurant search results
  // (which is a property of the restaurantService to be available to several components) to then be inspected by
  // the next filter.
  public filterByCuisine(italian:string, chinese:string, texMex:string, indian:string, steakHouse:string, seafood:string): void{
    let ambianceFilterResults = this.restaurantService.restaurantSearchResults;
    if (italian !== "" || chinese !== "" || texMex !== "" || indian !== "" || steakHouse !== "" || seafood !== "")  // if at least one ambiance filter was selected
    {
      this.restaurantService.restaurantSearchResults = [];
      for (let restaurant of ambianceFilterResults)
      {
        if (restaurant.foodType === italian || restaurant.foodType === chinese || restaurant.foodType === texMex
            || restaurant.foodType === indian || restaurant.foodType === steakHouse || restaurant.foodType === seafood) 
          this.restaurantService.restaurantSearchResults.push(restaurant);
      }
    }
  }


  // If there was at least one letter in "search by name" text input, this method will modify the list of restaurant 
  // search results (which is a property of the restaurantService to be available to several components) to then be 
  // deliver the final result from filtering chain.
  public filterByname(restName:string): void{
    let cuisineFilterResults = this.restaurantService.restaurantSearchResults;
    if (restName !== "")          // if there is at least one letter in filter by name (text input)
    {
      this.restaurantService.restaurantSearchResults = [];
      for (let restaurant of cuisineFilterResults)
      {
        if (restaurant.name.toLowerCase().indexOf(restName.toLowerCase()) == 0)
          this.restaurantService.restaurantSearchResults.push(restaurant);
      }
    }
  }


  public filterByZipCode(restZipCode: string): void{
    let byNameFilterResults = this.restaurantService.restaurantSearchResults;
    if (restZipCode != "")          // if there is at least one letter in filter by name (text input)
    {
      this.restaurantService.restaurantSearchResults = [];
      for (let restaurant of byNameFilterResults)
      {
        if (restaurant.locZipCode.indexOf(restZipCode) == 0)
          this.restaurantService.restaurantSearchResults.push(restaurant);
      }
    }


  }



  // This method gets the form (filterForm) and store the value of each filter in a variable (a value
  // that is within the range of values stored in the database and that are meaningful to the 
  // application's logic), while assigning a 0 or "" (accordingly) to the variable if such checkbox was 
  // not selected. Then it lets the entire list of restaurants go through a chain of filters (one by one).
  public applyFilters(filters: NgForm): void{
    this.restaurantService.restaurantSearchResults = this.restaurantService.restaurants;
    // giving the value of 0 or "" to each filter that was not selected (to get no matches on search)
    // and creating meaningful variables (with values other than just "true" of "false") to compare 
    // against the attributes from the "restaurant" table on the Database.
    let low = (!filters.value.lowPriceOption)? 0: 1;
    let medium = (!filters.value.mediumPriceOption)? 0: 2;
    let high = (!filters.value.highPriceOption)? 0: 3;
    let oneStar = (!filters.value.oneStar)? 0: 1;
    let twoStars = (!filters.value.twoStars)? 0: 2;
    let threeStars = (!filters.value.threeStars)? 0: 3;
    let fourStars = (!filters.value.fourStars)? 0: 4;
    let fiveStars = (!filters.value.fiveStars)? 0: 5;
    let casual = (!filters.value.casualOption)? "": "Casual";
    let semiCasual = (!filters.value.semiCasualOption)? "": "Semi Casual";
    let formal = (!filters.value.formalOption)? "": "Formal";
    let italian = (!filters.value.italianOption)? "": "Italian";
    let chinese = (!filters.value.chineseOption)? "": "Chinese";
    let texMex = (!filters.value.texMexOption)? "": "Tex Mex";
    let indian = (!filters.value.indianOption)? "": "Indian";
    let steakHouse = (!filters.value.steakHouseOption)? "": "Steak House";
    let seafood = (!filters.value.seafoodOption)? "": "Sea Food";
    let restName = (!filters.value.restName)? "": filters.value.restName;
    let restZipCode = (!filters.value.restZipCode)? "": filters.value.restZipCode;

    // The next method calls make the filtering one filter at a time, while shortening/narrowing the 
    // restaurantService.restaurantSearchResults list from being the entire list of restaurants to a 
    // completely filtered list.  

    this.filterByPrice(low,medium,high);   // passing through filter by Price
    
    this.filterByRating(oneStar,twoStars,threeStars,fourStars,fiveStars);   // passing through filter by Rating

    this.filterByAmbiance(casual,semiCasual,formal);   // passing through filter by Ambiance

    this.filterByCuisine(italian,chinese,texMex,indian,steakHouse,seafood);  // passing through filter by Cuisine

    this.filterByname(restName);  // passing through filter by name

    this.filterByZipCode(restZipCode); // passing through filter by ZipCode
  }



}
