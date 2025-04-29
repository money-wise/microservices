import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  readonly password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  readonly firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  readonly lastName: string;
}

export class LoginUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  readonly password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    description: 'User profile information',
  })
  user: Record<string, any>;
}
