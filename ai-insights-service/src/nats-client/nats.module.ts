// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     ClientsModule.registerAsync([
//       {
//         name: 'NATS_SERVICE',
//         imports: [ConfigModule],
//         inject: [ConfigService],
//         useFactory: (configService: ConfigService) => {
//           // Default to nats://nats:4222 if environment variable is not set
//           const natsUrl =
//             configService.get<string>('NATS_URL') || 'nats://nats:4222';
//           console.log(`Connecting to NATS server at: ${natsUrl}`);

//           return {
//             transport: Transport.NATS,
//             options: {
//               // servers: [natsUrl],
//               servers: ['nats://nats:4222'],
//               // Add connection retry options
//               reconnect: true,
//               reconnectTimeWait: 2000,
//               maxReconnectAttempts: 10,
//               waitOnFirstConnect: true,
//             },
//           };
//         },
//       },
//     ]),
//   ],

//   exports: [
//     ClientsModule.registerAsync([
//       {
//         name: 'NATS_SERVICE',
//         imports: [ConfigModule],
//         inject: [ConfigService],
//         useFactory: (configService: ConfigService) => {
//           // Default to nats://nats:4222 if environment variable is not set
//           const natsUrl =
//             configService.get<string>('NATS_URL') || 'nats://nats:4222';

//           return {
//             transport: Transport.NATS,
//             options: {
//               // servers: [natsUrl],
//               servers: ['nats://nats:4222'],
//               // Add connection retry options
//               reconnect: true,
//               reconnectTimeWait: 2000,
//               maxReconnectAttempts: 10,
//               waitOnFirstConnect: true,
//             },
//           };
//         },
//       },
//     ]),
//   ],
// })
// export class NatsClientModule {}
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],

  exports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
})
export class NatsClientModule {}
