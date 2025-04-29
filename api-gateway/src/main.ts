import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Money Wise API')
    .setDescription('Financial management APIs for Money Wise application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('transactions', 'Transaction management endpoints')
    .addTag('budgets', 'Budget management endpoints')
    .addTag('analytics', 'Financial analytics endpoints')
    .addTag('insights', 'AI-powered financial insights')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'list',
      filter: true,
      persistAuthorization: true,
    },
  });

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
