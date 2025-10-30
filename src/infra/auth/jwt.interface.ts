import { Role } from 'generated/prisma';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}
