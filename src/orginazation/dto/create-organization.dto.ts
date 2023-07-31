import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
export class CreateOrganizationDto {
  @IsNotEmpty()
  @MinLength(4)
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  readonly description: string;
  readonly createdBy: string;
  isDeleted: boolean;
  avtUrl: string;
}
