import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Member } from './member';
import { environment } from 'src/environments/environment'

// Service that sends the proper requests to the Backend's 
// memberService, in order to receive the necessary data 
// from the Member entity in the Database.

@Injectable({
    providedIn:  'root'
})
export class MemberService
{
    private apiServerUrl = environment.apiBaseUrl;

    // Injecting the built in HttpClient to make http requests to backend
    constructor(private http: HttpClient) {}
     
    public getAllMembers(): Observable<Member[]> {
        return this.http.get<Member[]>(`${this.apiServerUrl}/api/member/find/all`)
    }

    public getMember(memberId: string): Observable<Member> {
        return this.http.get<Member>(`${this.apiServerUrl}/api/member/find/${memberId}`)
    }

    public addMember(member: Member): Observable<Member> {
        return this.http.post<Member>(`${this.apiServerUrl}/api/member/add`, member)
    }    
        
    public updateMember(member: Member): Observable<Member> {
        return this.http.put<Member>(`${this.apiServerUrl}/api/member/update`, member)
    }  
    
    public deleteMember(memberId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/member/delete/${memberId}`)
    }    
    
}
