// To represent the type of data we will receive from
// the backend when accessing restaurantService.
export interface Restaurant 
{
    id: number;
    name: string;
    locState: string;
    locZipCode: string;
    avgScore: number;
    foodType: string;
    ambiance: string;
    priceLevel: string;
}