export class RegisterUserDto {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
}

export class LoginUserDto {
  readonly email: string;
  readonly password: string;
}
