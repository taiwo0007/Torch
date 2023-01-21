import {Make} from "./make.interface";

export interface Escooter {
    id: number;
    host: number;
    make: Make;
    modelName: string;
    trips: number;
    cost: number;
    rating: number;
    image: string;
    maxSpeed: number;
    maxWeight: number;
    scooterWeight: number;
    motorPower: number;
    maxRange: number;
    waterResistant?: any;
    about: string;
    inUse?: any;
    longitude: number;
    latitude: number;
    address: string;
    county: string;
    country: string;
    tripStart: Date;
    tripEnd: Date;
    escooterReviews: any[];
    active?: any;
}
