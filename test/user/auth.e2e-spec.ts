import * as request from 'supertest';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

describe('Auth user (e2e)', () => {
  const app = APP_URL;
  const newUserFirstName = `Tester${Date.now()}`;
  const newUserLastName = `E2E`;
  const newUserEmail = `User.${Date.now()}@example.com`;
  const newUserPassword = `secret`;

  it('Login: /api/v1/auth/passenger/login (POST)', () => {
    return request(app)
      .post('/api/v1/auth/passenger/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.email).toBeDefined();
        expect(body.user.hash).not.toBeDefined();
        expect(body.user.password).not.toBeDefined();
        expect(body.user.previousPassword).not.toBeDefined();
      });
  });

  it('Login via admin endpoint: /api/v1/auth/admin/login (POST)', () => {
    return request(app)
      .post('/api/v1/auth/admin/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .expect(422);
  });

  it('Login via admin endpoint with extra spaced: /api/v1/auth/admin/login (POST)', () => {
    return request(app)
      .post('/api/v1/auth/admin/login')
      .send({ email: TESTER_EMAIL + '  ', password: TESTER_PASSWORD })
      .expect(422);
  });

  it('Do not allow register user with exists email: /api/v1/auth/register (POST)', () => {
    return request(app)
      .post('/api/v1/auth/register')
      .send({
        email: TESTER_EMAIL,
        password: TESTER_PASSWORD,
        firstName: 'Tester',
        lastName: 'E2E',
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.errors.email).toBeDefined();
      });
  });

  it('Register new user: /api/v1/auth/register (POST)', async () => {
    return request(app)
      .post('/api/v1/auth/register')
      .send({
        email: newUserEmail,
        password: newUserPassword,
        firstName: newUserFirstName,
        lastName: newUserLastName,
      })
      .expect(201);
  });

  // it('Login unconfirmed user: /api/v1/auth/email/login (POST)', () => {
  //   return request(app)
  //     .post('/api/v1/auth/email/login')
  //     .send({ email: newUserEmail, password: newUserPassword })
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body.token).toBeDefined();
  //     });
  // });

  // it('Login confirmed user: /api/v1/auth/email/login (POST)', () => {
  //   return request(app)
  //     .post('/api/v1/auth/email/login')
  //     .send({ email: newUserEmail, password: newUserPassword })
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body.token).toBeDefined();
  //       expect(body.user.email).toBeDefined();
  //     });
  // });

  // it('Confirmed user retrieve profile: /api/v1/auth/me (GET)', async () => {
  //   const newUserApiToken = await request(app)
  //     .post('/api/v1/auth/email/login')
  //     .send({ email: newUserEmail, password: newUserPassword })
  //     .then(({ body }) => body.token);

  //   await request(app)
  //     .get('/api/v1/auth/me')
  //     .auth(newUserApiToken, {
  //       type: 'bearer',
  //     })
  //     .send()
  //     .expect(({ body }) => {
  //       expect(body.provider).toBeDefined();
  //       expect(body.email).toBeDefined();
  //       expect(body.hash).not.toBeDefined();
  //       expect(body.password).not.toBeDefined();
  //       expect(body.previousPassword).not.toBeDefined();
  //     });
  // });

  // it('New user update profile: /api/v1/auth/me (PATCH)', async () => {
  //   const newUserNewName = Date.now();
  //   const newUserNewPassword = 'new-secret';
  //   const newUserApiToken = await request(app)
  //     .post('/api/v1/auth/email/login')
  //     .send({ email: newUserEmail, password: newUserPassword })
  //     .then(({ body }) => body.token);

  //   await request(app)
  //     .patch('/api/v1/auth/me')
  //     .auth(newUserApiToken, {
  //       type: 'bearer',
  //     })
  //     .send({
  //       firstName: newUserNewName,
  //       password: newUserNewPassword,
  //     })
  //     .expect(422);

  //   await request(app)
  //     .patch('/api/v1/auth/me')
  //     .auth(newUserApiToken, {
  //       type: 'bearer',
  //     })
  //     .send({
  //       firstName: newUserNewName,
  //       password: newUserNewPassword,
  //       oldPassword: newUserPassword,
  //     })
  //     .expect(200);

  //   await request(app)
  //     .post('/api/v1/auth/email/login')
  //     .send({ email: newUserEmail, password: newUserNewPassword })
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body.token).toBeDefined();
  //     });

  //   await request(app)
  //     .patch('/api/v1/auth/me')
  //     .auth(newUserApiToken, {
  //       type: 'bearer',
  //     })
  //     .send({ password: newUserPassword, oldPassword: newUserNewPassword })
  //     .expect(200);
  // });

  // it('New user delete profile: /api/v1/auth/me (DELETE)', async () => {
  //   const newUserApiToken = await request(app)
  //     .post('/api/v1/auth/email/login')
  //     .send({ email: newUserEmail, password: newUserPassword })
  //     .then(({ body }) => body.token);

  //   await request(app).delete('/api/v1/auth/me').auth(newUserApiToken, {
  //     type: 'bearer',
  //   });

  //   return request(app)
  //     .post('/api/v1/auth/email/login')
  //     .send({ email: newUserEmail, password: newUserPassword })
  //     .expect(422);
  // });
});
