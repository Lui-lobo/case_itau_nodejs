// Importando Modulos Comuns do Nest
import { INestApplication, ValidationPipe } from '@nestjs/common';
// Importando modulos de teste do nest
import { Test, TestingModule } from '@nestjs/testing';
// importando supertest para teste de integração
import request from 'supertest';
// Importando modulo da aplicação
import { AppModule } from '../../app.module';
// Importando serviço do prisma
import { PrismaService } from '../../apis/prisma/prisma.service';

export class TestAppFactory {
    app: INestApplication;
    prisma: PrismaService;

    async init() {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        this.app = moduleFixture.createNestApplication();

        this.app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        await this.app.init();

        this.prisma = this.app.get(PrismaService);
        return this;
    }

    getHttpServer() {
        return this.app.getHttpServer();
    }

    async close() {
        await this.prisma.$disconnect();
        await this.app.close();
    }

    async clearDatabase() {
        // lista de tabelas em ordem reversa de dependência (filhas → pais)
        //const orderedModels = [
        //    'transacao',        // depende de cliente
        //    'clienteClient',    // depende de cliente e client
        //    'cliente',
        //    'client',
        //];
        //
        //for (const model of orderedModels) {
        //    if ((this.prisma as any)[model]?.deleteMany) {
        //        await (this.prisma as any)[model].deleteMany({});
        //    }
        //}
        return true; // Evitando limpeza de banco pós testes de integração
    }

}
