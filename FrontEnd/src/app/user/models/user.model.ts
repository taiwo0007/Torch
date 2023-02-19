export class User{
  constructor(
    public email: string,
    private _token: string,
    private _isHost: boolean,
    private _tokenExpirationDate: Date
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

  get tokenExpireDate() {
    return this._tokenExpirationDate;
  }
}
