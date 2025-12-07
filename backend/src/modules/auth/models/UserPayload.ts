export interface UserPayload {
  id: number;
  email: string;
  role: string; // ou use 'Role' se estiver usando enum do Prisma
  iat?: number; // emitido em
  exp?: number; // expira em
}
