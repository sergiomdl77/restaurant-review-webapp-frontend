export interface Review
{
    rvId: number;
    restaurantId: number;
    memberId: string;
    rvDate: string;
    comment: string;
    score:number;
}