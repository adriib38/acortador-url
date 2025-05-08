const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/services/db');
const User = require('../src/models/User');
const Url = require('../src/models/Url');
const e = require('express');

// Utilidades para obtener token y cookie
async function signupAndLogin(username, password) {
  // Signup
  const res = await request(app)
    .post('/auth/signup')
    .send({ username, password });

  // Extrae la cookie refresh_token del header 'set-cookie'
  const setCookie = res.headers['set-cookie'];
  const refreshCookie = Array.isArray(setCookie)
    ? setCookie.find(c => c.startsWith('refresh_token='))
    : undefined;

  return {
    access_token: res.body.access_token,
    refreshCookie: refreshCookie, // Usar esto en .set('Cookie', ...)
    user: res.body.user,
  };
}

describe('Endpoints de autenticación y acortador', () => {
  let auth;
  const username = 'adriaaan';
  const password = 'Adriaaan123_';

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    auth = await signupAndLogin(username, password);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('Login correcto devuelve access_token', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({ username, password });
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(200);
    expect(res.body.access_token).toBeDefined();
  });

  test('Crear usuario nuevo devuelve access_token', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ username: 'adriaaan123', password: 'Adriaan_123' });
    console.log(res.statusCode, res.body, res.headers);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.access_token).toBeDefined();
  });

//   test('Cerrar sesión elimina refresh_token', async () => {
//     const res = await request(app)
//       .get('/auth/signout')
//       .set('Cookie', auth.cookie);
//     console.log(res.statusCode, res.body, res.headers);
//     expect(res.statusCode).toBe(200);
//   });

  test('Refresh token devuelve nuevo access_token', async () => {
    const res = await request(app)
      .get('/auth/refresh-token')
      .set('Cookie', auth.refreshCookie)
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(201);
    expect(res.body.access_token).toBeDefined();

  });

  let urlLong = 'https://www.google.com/';
  let urlShort;
  test('Crear short url autenticado', async () => {
    const res = await request(app)
      .post('/c')
      .set('authorization', `Bearer ${auth.access_token}`)
      .send({ url: urlLong });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.short).toBeDefined();

    urlShort = res.body.short;
  });

  test('Redirige a la URL original', async () => {
    const resPost = await request(app)
      .post('/c')
      .set('authorization', `Bearer ${auth.access_token}`)
      .send({ url: urlLong });

    console.log("Short URL: ", resPost.body.short);

    // Extrae solo el path relativo de la short url
    const extension = urlShort.split('/').pop();
    const resGet = await request(app)
        .get(`/${extension}`)
    console.log('Redirige status:', resGet.statusCode, 'headers:', resGet.headers);
    expect([301, 302, 307]).toContain(resGet.statusCode);
    expect(resGet.headers.location).toBe(urlLong);
  });

  test('Devuelve 404 para URL inexistente', async () => {
    const res = await request(app)
      .get('/noexisteurl');
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(404);

  });
});
