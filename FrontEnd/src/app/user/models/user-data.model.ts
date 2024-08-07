import {UserTripDetails} from "../../trip/models/user-trip-details";

export class UserData {
    constructor(

    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public  rating?: any,
    public phoneNumber?: number,
    public postCode?: any,
    public country?: string,
    public county?: string,
    public state?: any,
    public accountType?: any,
    public profilePicture?: string,
    public userTrips?: any,
    public roles?: any[],
    public host?: number,
    public hostReviews?: any[],
    public  scooterReviews?: any[],
    public renterTrips?: any[],
    public isVerified?: boolean,
    public isHost?: boolean,
    public profile?: string,
    public userTripDetails?: UserTripDetails,
    public lastTripDaysLeft?: number,
    public joined?:Date,
    public about?:string,
    public location?:string,
    public torchTrusted?:boolean,


    ) {
    }
}
