import {Escooter} from "./escooter.interface";

export interface Trip {
    id: number;
    eScooterOnTrip: Escooter;
    user_renter: number;
    trip_owner: number;
    tripStart: Date;
    tripEnd: Date;
    tripId: string;
    tripCost: number;
    status: string;

}
