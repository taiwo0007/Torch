export class UserData {
    constructor(
        public firstName: string,
        public lastName: string,
        public phoneNumber: number,
        public postCode: string,
        public country: string,
        public county: string,
        public email: string,
        public isVerified: Boolean,
        public userTrips: number,
        public rating: number,
        public id:number,
        public isHost: Boolean


    ) {
    }
}
