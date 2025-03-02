import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AccountsModule } from './accounts.module';
import { AccountsRepository } from './accounts.repository';
import { AuthGuard } from '../../src/auth/auth.guard';

describe('AccountsController (e2e)', () => {
  let app: INestApplication;
  let repository: AccountsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountsModule],
    })
      .overrideProvider(JwtService)
      .useValue({
        sign: jest.fn(() => 'mocked_token'),
        verify: jest.fn(() => ({ userId: 'test-user' })),
      })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    repository = moduleFixture.get<AccountsRepository>(AccountsRepository);

    await app.init();
  });

  afterEach(() => {
    repository.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve criar uma conta com saldo inicial', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'deposit', destination: 'user1', amount: 100 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('destination');
    expect(response.body.destination.balance).toBe(100);
  });

  it('Deve retornar 404 ao consultar saldo de conta inexistente', async () => {
    const response = await request(app.getHttpServer()).get(
      '/accounts/balance?account_id=nonexistent-id',
    );
    expect(response.status).toBe(404);
  });

  it('Deve depositar em uma conta existente', async () => {
    await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'deposit', destination: 'user1', amount: 100 });

    const depositResponse = await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'deposit', destination: 'user1', amount: 50 });

    expect(depositResponse.status).toBe(201);
    expect(depositResponse.body.destination.balance).toBe(150);
  });

  it('Deve sacar de uma conta existente', async () => {
    await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'deposit', destination: 'user1', amount: 200 });

    const withdrawResponse = await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'withdraw', origin: 'user1', amount: 50 });

    expect(withdrawResponse.status).toBe(201);
    expect(withdrawResponse.body.origin.balance).toBe(150);
  });

  it('Deve transferir saldo entre contas', async () => {
    await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'deposit', destination: 'user1', amount: 300 });

    await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'deposit', destination: 'user2', amount: 100 });

    const transferResponse = await request(app.getHttpServer())
      .post('/accounts/event')
      .send({
        type: 'transfer',
        origin: 'user1',
        destination: 'user2',
        amount: 50,
      });

    expect(transferResponse.status).toBe(201);
    expect(transferResponse.body.origin.balance).toBe(250);
    expect(transferResponse.body.destination.balance).toBe(150);
  });

  it('Deve retornar 404 ao tentar sacar de uma conta inexistente', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts/event')
      .send({ type: 'withdraw', origin: 'nonexistent-id', amount: 50 });

    expect(response.status).toBe(404);
  });
});
