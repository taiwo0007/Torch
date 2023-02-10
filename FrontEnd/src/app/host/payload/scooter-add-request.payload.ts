import {Make} from "../../escooter/models/make.interface";

export interface ScooterAddRequestPayload{
   make:Make;
   modelName:string;
   cost:number;
    maxSpeed:number;
    maxWeight:number;
    scooterWeight:number;
    motorPower:number;
    maxRange:number;
    tripStart:Date;
    tripEnd:Date;
    waterResistant:boolean;
    image:any;
    country:string;
    about:string;
    fileName:string
    contentType:string;
}
