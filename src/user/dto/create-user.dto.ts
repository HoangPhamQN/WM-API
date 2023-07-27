export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly avtUrl: string;
  role: [string];
  organization: [string];
}
