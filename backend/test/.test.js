const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/services/db');

const USERNAME = 'adrian';
const PASSWORD = 'Adriaaan123_';

async function signupAndLogin(username, password) {
  // Signup
  const res = await request(app)
    .post('/auth/signup')
    .send({ username, password });

  //Get access_token and refresh_token
  const setCookie = res.headers['set-cookie'];
  const refreshCookie = setCookie.find(c => c.startsWith('refresh_token='));

  return {
    access_token: res.body.access_token,
    refreshCookie: refreshCookie,
    user: res.body.user,
  };
}


describe('Authentication and URL shortening endpoints', () => {
  let auth;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    auth = await signupAndLogin(USERNAME, PASSWORD);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Login success returns access_token', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({ username: USERNAME, password: PASSWORD });
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(200);
    expect(res.body.access_token).toBeDefined();
  });

  test('Signup new user returns access_token and refresh_token', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ username: USERNAME + '123', password: PASSWORD + '123' });
    console.log(res.statusCode, res.body, res.headers);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.access_token).toBeDefined();
    expect(auth.refreshCookie).toBeDefined();
  });

  test('Refresh token returns new access_token', async () => {
    const res = await request(app)
      .get('/auth/refresh-token')
      .set('Cookie', auth.refreshCookie)
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(201);
    expect(res.body.access_token).toBeDefined();

  });

  test('Logout removes refresh_token', async () => {
    const res = await request(app)
      .get('/auth/signout')
      .set('Cookie', auth.refreshCookie)
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(200);
  });

  let urlLong = 'https://www.google.com/';
  let urlShort;
  test('Create new short URL returns short URL', async () => {
    const res = await request(app)
      .post('/c')
      .set('authorization', `Bearer ${auth.access_token}`)
      .send({ url: urlLong });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.short).toBeDefined();

    urlShort = res.body.short;
  });

  test('Redirect to long URL', async () => {
    const resPost = await request(app)
      .post('/c')
      .set('authorization', `Bearer ${auth.access_token}`)
      .send({ url: urlLong });

    console.log("Short URL: ", resPost.body.short);

    const extension = urlShort.split('/').pop();
    const resGet = await request(app)
        .get(`/${extension}`)
    console.log('Redirige status:', resGet.statusCode, 'headers:', resGet.headers);
    expect([301, 302, 307]).toContain(resGet.statusCode);
    expect(resGet.headers.location).toBe(urlLong);
  });

  test('Returns 404 for non-existent URL', async () => {
    const res = await request(app)
      .get('/noexisteurl');
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(404);

  });
});

// TODO:
// DELETE short URL
// DELETE user account
// GET user info