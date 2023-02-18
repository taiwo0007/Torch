import {UserData} from "../../user/models/user-data.model";

export interface HostReview {
    id: number;
    host: number;
    user_reviewer: any;
    reviewDate: Date;
    comment: string;
    starRating: number;
}
