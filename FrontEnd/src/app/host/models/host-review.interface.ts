import {UserData} from "../../user/models/user-data.model";

export interface HostReview {
    id: number;
    host: number;
    user_reviewer: UserData;
    reviewDate: Date;
    comment: string;
    starRating: number;
}
