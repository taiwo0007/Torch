import {Escooter} from "../../escooter/models/escooter.interface";
import {Trip} from "../../escooter/models/trip.interface";
import {UserData} from "../../user/models/user-data.model";

export interface Host {
    id: number;
    hostUser: UserData;
    hostReviews: any[];
    hostEScooters: Escooter[];
    hostTrips: Trip[];
    scooterUseDetail: any;
}
