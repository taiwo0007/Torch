export class User{
  constructor(
    public email: string,
    private _token: string,
    private _isHost: boolean
    // private _tokenExpirationDate: Date
  ) {}

  get token() {
    return this._token;
  }

  get isHost() {
    return this._isHost;
  }
}
