export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly avtUrl: string;
  readonly refreshToken: string;
  role: [string];
  organization: [string];
}
