const request = require("supertest");
const app = require("../src/app");
const sequelize = require("../src/services/db");
const { access } = require("fs");

const USERNAME = "adrian";
const PASSWORD = "Adriaaan123_";

async function signupAndLogin(username, password) {
  // Signup
  const res = await request(app)
    .post("/auth/signup")
    .send({ username, password });

  //Get access_token and refresh_token
  const setCookie = res.headers["set-cookie"];
  const refreshCookie = setCookie.find((c) => c.startsWith("refresh_token="));

  return {
    access_token: res.body.access_token,
    refreshCookie: refreshCookie,
    user: res.body.user,
  };
}

describe("Authentication and URL shortening endpoints", () => {
  let auth;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    auth = await signupAndLogin(USERNAME, PASSWORD);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("Login success returns access_token", async () => {
    const res = await request(app)
      .post("/auth/signin")
      .send({ username: USERNAME, password: PASSWORD });
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(200);
    expect(res.body.access_token).toBeDefined();
  });

  test("Signup new user returns access_token and refresh_token", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ username: USERNAME + "123", password: PASSWORD + "123" });
    console.log(res.statusCode, res.body, res.headers);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.access_token).toBeDefined();
    expect(auth.refreshCookie).toBeDefined();
  });

  test("Refresh token returns new access_token", async () => {
    const res = await request(app)
      .get("/auth/refresh-token")
      .set("Cookie", auth.refreshCookie);
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(201);
    expect(res.body.access_token).toBeDefined();
  });

  test("Logout removes refresh_token", async () => {
    const res = await request(app)
      .get("/auth/signout")
      .set("Cookie", auth.refreshCookie);
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(200);
  });

  let urlLong = "https://www.google.com/";
  let urlShort;
  test("Create new short URL returns short URL", async () => {
    const res = await request(app)
      .post("/c")
      .set("authorization", `Bearer ${auth.access_token}`)
      .send({ url: urlLong });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.short).toBeDefined();

    urlShort = res.body.short;
  });

  test("Redirect to long URL", async () => {
    const resPost = await request(app)
      .post("/c")
      .set("authorization", `Bearer ${auth.access_token}`)
      .send({ url: urlLong });

    console.log("Short URL: ", resPost.body.short);

    const extension = urlShort.split("/").pop();
    const resGet = await request(app).get(`/${extension}`);
    console.log(
      "Redirige status:",
      resGet.statusCode,
      "headers:",
      resGet.headers
    );
    expect([301, 302, 307]).toContain(resGet.statusCode);
    expect(resGet.headers.location).toBe(urlLong);
  });

  test("Returns 404 for non-existent URL", async () => {
    const res = await request(app).get("/noexisteurl");
    console.log(res.statusCode, res.body, res.headers);
    expect(res.statusCode).toBe(404);
  });

  test("Signout removes refresh_token and access_token and blocks further access", async () => {
    // Send signout request
    const logoutRes = await request(app)
      .get("/auth/signout")
      .set("Cookie", auth.refreshCookie);

    //Verify that logout was successful with status 200
    expect(logoutRes.statusCode).toBe(200);

    // Expect.headers['set-cookie'] || [];
    const setCookies = logoutRes.headers["set-cookie"] || [];

    //Save cookies for later verification
    const accessCookie = setCookies.find((c) => c.startsWith("access_token="));
    const refreshCookie = setCookies.find((c) =>
      c.startsWith("refresh_token=")
    );

    //Verify that cookies are set
    expect(accessCookie).toBeDefined();
    expect(refreshCookie).toBeDefined();

    // Verify that cookies are set to invalid (none) value
    expect(accessCookie).toMatch(/access_token=(;|none)/);
    expect(refreshCookie).toMatch(/refresh_token=(;|none)/);

    //Try to access protected route with the original refresh token
    const reqToProtectedRouteOriginalRefreshToken = await request(app)
      .get("/auth/get-user")
      .set("Cookie", auth.refreshCookie);
    // Verify that access is blocked
    expect(reqToProtectedRouteOriginalRefreshToken.statusCode).toBe(403);

    // Verify that the response contains an error message
    const accessToken = accessCookie
      ? accessCookie.split(";")[0].split("=")[1]
      : null;
    const reqToProtectedRouteNewAccessToken = await request(app)
      .get("/auth/get-user")
      .set("authorization", `Bearer ${accessToken}`);
    expect(reqToProtectedRouteNewAccessToken.statusCode).toBe(401);
  });
});

// TODO:
// DELETE short URL
// DELETE user account
// GET user info
