export interface IUser {
  readonly id?: string;
  email: string;
  password?: string;
  readonly createdAt?: Date | null;
  readonly updatedAt?: Date | null;
  readonly deletedAt?: Date | null;
}
