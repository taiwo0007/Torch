export interface LoginResponsePayload{
  authToken: string;
  expiresAt: string;
  email: string,
  isHost:boolean,
  isVerified:boolean,
  hostID:number
}
