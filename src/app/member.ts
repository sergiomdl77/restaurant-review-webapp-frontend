// To represent the type of data we will receive from
// the backend when accessing memberService.
export interface Member 
{
    id: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    locCity: string;
    locState: string;
    locZipCode: string;
    gender: string;
    email: string;
}