import {Escooter} from "../../escooter/models/escooter.interface";
import {Trip} from "../../escooter/models/trip.interface";
import {UserData} from "../../user/models/user-data.model";
import {ScooterUseDetails} from "./scooter-user-detail.interface";

export interface Host {
    id: number;
    hostUser: UserData;
    hostReviews: any[];
    hostEScooters: Escooter[];
    hostTrips?: any[];
    scooterUseDetail: ScooterUseDetails;
}
