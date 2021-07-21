import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-main',
  templateUrl: './member-main.component.html',
  styleUrls: ['./member-main.component.css']
})
export class MemberMainComponent {

  constructor(public memberService: MemberService) {}

  public filterByname(memberId:string): void{
    let allMembers = this.memberService.members;
    if (memberId !== "")          // if there is at least one letter in filter by name (text input)
    {
      this.memberService.memberSearchResults = [];
      for (let member of allMembers)
      {
        if (member.id.toLowerCase().indexOf(memberId.toLowerCase()) == 0)
          this.memberService.memberSearchResults.push(member);
      }
    }
  }


  public filterByZipCode(memberZipCode: string): void{
    let byNameFilterResults = this.memberService.memberSearchResults;
    if (memberZipCode != "")          // if there is at least one letter in filter by name (text input)
    {
      this.memberService.memberSearchResults = [];
      for (let member of byNameFilterResults)
      {
        if (member.locZipCode.indexOf(memberZipCode) == 0)
          this.memberService.memberSearchResults.push(member);
      }
    }
  }



  // This method gets the form (filterForm) and store the value of each filter in a variable (a value
  // that is within the range of values stored in the database and that are meaningful to the 
  // application's logic), while assigning a 0 or "" (accordingly) to the variable if such checkbox was 
  // not selected. Then it lets the entire list of members go through a chain of filters (one by one).
  public applyFilters(filters: NgForm): void{
    this.memberService.memberSearchResults = this.memberService.members;
    // giving the value of 0 or "" to each filter that was not selected (to get no matches on search)
    // and creating meaningful variables (with values other than just "true" of "false") to compare 
    // against the attributes from the "member" table on the Database.
    let memberId = (!filters.value.memberId)? "": filters.value.memberId;
    let memberZipCode = (!filters.value.memberZipCode)? "": filters.value.memberZipCode;

    // The next method calls make the filtering one filter at a time, while shortening/narrowing the 
    // memberService.memberSearchResults list from being the entire list of members to a 
    // completely filtered list.  

    this.filterByname(memberId);  // passing through filter by name

    this.filterByZipCode(memberZipCode); // passing through filter by ZipCode
  }

}
