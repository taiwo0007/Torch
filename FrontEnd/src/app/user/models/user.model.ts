export class User{
  constructor(
    public email: string,
    private _token: string,
    private _isHost: boolean,
    private _tokenExpirationDate: Date,
    private _isVerified: boolean,
    private _hostID: number,
    public isVerifiedConsent:boolean,
    private _accountType: string,
  ) {}



  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get isHost() {
    return this._isHost;
  }
  get accountType() {
    return this._accountType;
  }

  get isVerified(){
    return this._isVerified;
  }

  get hostID(){

    return this._hostID;
  }


  get tokenExpireDate() {
    return this._tokenExpirationDate;
  }
}
