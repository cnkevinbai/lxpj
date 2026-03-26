export interface User {
  id: string;
  username: string;
  password?: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

export interface JwtPayload {
  id: string;
  username: string;
  role?: string;
}
