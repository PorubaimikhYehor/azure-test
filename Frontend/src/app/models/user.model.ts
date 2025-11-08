export interface User {
  id: string;
  name: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUser {
  name: string;
  lastName: string;
  role: string;
}

export interface UpdateUser {
  name?: string;
  lastName?: string;
  role?: string;
}