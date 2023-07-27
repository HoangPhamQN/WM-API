export class CreateOrganizationDto {
  readonly name: string;
  readonly email: string;
  readonly description: string;
  isDeleted: boolean;
  readonly createdBy: string;
  avtUrl: string;
}
