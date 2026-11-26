import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { RolesGuard } from './common/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  const swaggerConfig = new DocumentBuilder().setTitle('EventLink LK Vendor Service').setDescription('Vendor profiles, packages, availability, and review endpoints').setVersion('1.0').addApiKey({ type: 'apiKey', in: 'header', name: 'x-user-id' }, 'x-user-id').addApiKey({ type: 'apiKey', in: 'header', name: 'x-user-role' }, 'x-user-role').addSecurityRequirements('x-user-id').addSecurityRequirements('x-user-role').build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
  await app.listen(Number(config.get('PORT', 3001)), '0.0.0.0');
}
bootstrap();
