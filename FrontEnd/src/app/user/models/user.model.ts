export class User{
  constructor(
    public email: string,
    private _token: string
  ) {}




  get token() {
    return this._token;
  }
}
