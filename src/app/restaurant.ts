// To represent the type of data we will receive from
// the backend when accessing restaurantService.
export interface Restaurant 
{
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    locCity: string;
    locState: string;
    locZipCode: string;
    avgScore: number;
    reviewCount: number;
    foodType: string;
    ambiance: string;
    priceLevel: number;
    imageUrl: string;
    description: string;
}