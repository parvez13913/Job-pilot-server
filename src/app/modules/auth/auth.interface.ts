export interface ISignUpPayload {
  name?: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
}
