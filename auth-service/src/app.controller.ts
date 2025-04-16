import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'REGISTER_USER' })
  register(@Payload() data: RegisterUserDto) {
    return this.appService.register(data);
  }

  @MessagePattern({ cmd: 'LOGIN_USER' })
  login(@Payload() data: LoginUserDto) {
    return this.appService.login(data);
  }
}
