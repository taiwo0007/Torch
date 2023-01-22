import {UserData} from "../../user/models/user-data.model";

export interface ScooterReviewer{

    id: number;
    scooter_reviewer: number;
    reviewDate: Date;
    comment: string;
    starRating: number;

}
