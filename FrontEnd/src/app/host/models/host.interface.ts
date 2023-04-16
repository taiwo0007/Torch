import {Escooter} from "../../escooter/models/escooter.interface";
import {Trip} from "../../escooter/models/trip.interface";
import {UserData} from "../../user/models/user-data.model";
import {ScooterUseDetails} from "./scooter-user-detail.interface";
import {HostReview} from "./host-review.interface";
import {Insurance} from "./insurance.interface";

export interface Host {
    id: number;
    hostUser: UserData;
    hostReviews: HostReview[];
    hostEScooters: Escooter[];
    hostTrips?: any[];
    scooterUseDetail: ScooterUseDetails;
    totalAdDays?:number;
    insurance:Insurance
}
