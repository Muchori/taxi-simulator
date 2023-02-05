export interface IUsers {
  readonly id: string;
  readonly name: string;
  readonly phoneNumber: string;
  readonly email: string;
  readonly suspended?: boolean;
  readonly password: string;
}
