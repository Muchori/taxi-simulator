import * as request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Auth admin (e2e)', () => {
  const app = APP_URL;

  it('Login: /api/v1/auth/admin/login (POST)', () => {
    return request(app)
      .post('/api/v1/auth/admin/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.email).toBeDefined();
      });
  });

  it('Login via user endpoint: /api/v1/auth/passenger/login (POST)', () => {
    return request(app)
      .post('/api/v1/auth/passenger/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(422);
  });
});
