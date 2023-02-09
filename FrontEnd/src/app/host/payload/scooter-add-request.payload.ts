export interface ScooterAddRequestPayload{
   make:string;
   modelName:string;
   cost:number;
    maxSpeed:number;
    maxWeight:number;
    scooterWeight:number;
    motorPower:number;
    maxRange:string;
    tripStart:Date;
    tripEnd:Date;
    waterResistant:boolean;
    image:File;
    country:string;
    about:string;
}
