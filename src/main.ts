// Importando Aplicação Core do nestJs
import { NestFactory } from '@nestjs/core';
// Importando modulo da aplicação
import { AppModule } from './app.module';
// Importando Libs de validação e segurança
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
// importando Libs de documentação do swagger para nest
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Definindo a aplicação
  const app = await NestFactory.create(AppModule);

  // Segurança básica
  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });

  // Validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // remove campos extra
    forbidNonWhitelisted: true,   // erro se enviar campos não esperados
    transform: true,              // converte tipos automaticamente (query/params/body)
  }));

  // Swagger (documentação)
  const config = new DocumentBuilder()
    .setTitle('APIs de Ativos Digitais')
    .setDescription('APIs de Ativos Digitai (NestJS + Prisma)')
    .setVersion('1.0.0')
    .addBearerAuth() // Para endpoints com Auth
    .addTag('clientes', 'Operações relacionadas a clientes')
    .addTag('transacoes', 'Operações financeiras')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Iniciando servidor
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
