import {Escooter} from "../../escooter/models/escooter.interface";
import {UserData} from "../../user/models/user-data.model";
import {Host} from "../../host/models/host.interface";

export interface Trip {
    id: number;
    eScooterOnTrip: Escooter;
    user_renter: UserData;
    trip_owner: Host;
    tripStart: Date;
    tripEnd: Date;
    tripId: string;
    tripCost: number;
    days: number;
    status: string;

}
