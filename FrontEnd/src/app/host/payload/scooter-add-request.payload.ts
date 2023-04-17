import {Make} from "../../escooter/models/make.interface";

export interface ScooterAddRequestPayload{
   make:string;
   modelName:string;
   cost:number;
    maxSpeed:number;
    maxWeight:number;
    scooterWeight:number;
    motorPower:number;
    maxRange:number;
    tripStart:string;
    tripEnd:string;
    waterResistant:boolean;
    image:any;
    country:string;
    about:string;
    fileName:string
    contentType:string;
}
