import { StatusEnum } from '../../src/modules/statuses/statuses.enum';
import { RoleEnum } from '../../src/modules/roles/roles.enum';
import { APP_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/constants';
import * as request from 'supertest';

describe('Users admin (e2e)', () => {
  const app = APP_URL;
  let newUserFirst: any;
  const newUserEmailFirst = `user-first.${Date.now()}@example.com`;
  const newUserPasswordFirst = `secret`;
  const newUserChangedPasswordFirst = `new-secret`;
  const newUserByAdminEmailFirst = `user-created-by-admin.${Date.now()}@example.com`;
  const newUserByAdminPasswordFirst = `secret`;
  let apiToken: string;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/admin/passenger/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ body }) => {
        apiToken = body.token;
      });

    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: newUserEmailFirst,
        password: newUserPasswordFirst,
        firstName: `First${Date.now()}`,
        lastName: 'E2E',
      });

    await request(app)
      .post('/api/v1/auth/driver/login')
      .send({ email: newUserEmailFirst, password: newUserPasswordFirst })
      .then(({ body }) => {
        newUserFirst = body.user;
      });
  });

  it('Login via registered user: /api/v1/auth/passenger/login (GET)', () => {
    return request(app)
      .post('/api/v1/auth/passenger/login')
      .send({ email: newUserEmailFirst, password: newUserChangedPasswordFirst })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('Fail create new user by admin: /api/v1/passenger (POST)', () => {
    return request(app)
      .post(`/api/v1/passenger`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({ email: 'fail-data' })
      .expect(422);
  });

  it('Success create new user by admin: /api/v1/passenger (POST)', () => {
    return request(app)
      .post(`/api/v1/passenger`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        email: newUserByAdminEmailFirst,
        password: newUserByAdminPasswordFirst,
        firstName: `UserByAdmin${Date.now()}`,
        lastName: 'E2E',
        role: {
          id: RoleEnum.user,
        },
        status: {
          id: StatusEnum.active,
        },
      })
      .expect(201);
  });

  it('Login via created by admin user: /api/v1/auth/passenger/login (GET)', () => {
    return request(app)
      .post('/api/v1/auth/passenger/login')
      .send({
        email: newUserByAdminEmailFirst,
        password: newUserByAdminPasswordFirst,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('Get list of users by admin: /api/v1/passenger (GET)', () => {
    return request(app)
      .get(`/api/v1/passenger`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .expect(200)
      .send()
      .expect(({ body }) => {
        expect(body.data[0].provider).toBeDefined();
        expect(body.data[0].email).toBeDefined();
        expect(body.data[0].hash).not.toBeDefined();
        expect(body.data[0].password).not.toBeDefined();
        expect(body.data[0].previousPassword).not.toBeDefined();
      });
  });
});
