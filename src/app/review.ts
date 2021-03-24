export interface Review
{
    rvId: number;
    restaurantId: number;
    memberId: string;
    rvDate: Date;
    comment: string;
    score:number;
}