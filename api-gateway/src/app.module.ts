import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsClientModule } from './nats-client/nats.module';
import { JwtStrategy } from './jwt.strategy';
// import { NatsClientModule } from '../../shared/nats-client/nats.module';

@Module({
  imports: [NatsClientModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
