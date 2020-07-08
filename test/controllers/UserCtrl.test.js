const request = require("supertest");
const expect = require("chai").expect;

const { beforeAction, afterAction } = require("../setup/setup");
const model = require("../../models");

describe("UserController ", async () => {
  let api;

  before(async () => {
    api = await beforeAction();
  });

  after(() => {
    afterAction();
  });

  describe("POST /users/signup | User SignUp", () => {
    it("should return profile and token when request is OK! ", async () => {
      const res = await request(api)
        .post("/api/users/signup")
        .send({
          phone: "9840056258",
          name: "rojan",
          password: "hashedpswd",
          lat: 27.8,
          long: 81.5,
          fcmToken: "testtoken",
          role: "user",
          email: "test@gmail.com",
        })
        .expect(200);

      expect(res.body).to.have.all.key(["token", "profile"]);
    });

    it("should return error message when phone already exists", async () => {
      const res = await request(api)
        .post("/api/users/signup")
        .send({
          phone: "9840056258",
          name: "rojan",
          password: "hashedpswd",
          lat: 27.8,
          long: 81.5,
          fcmToken: "testtoken",
          role: "user",
          email: "test@gmail.com",
        })
        .expect(400);

      const { isSuccess } = res.body;
      expect(isSuccess).to.equal(false);
    });
  });

  describe("POST /users/signin | User SignIn", () => {
    it("should return profile and token when request is OK", async () => {
      const res = await request(api)
        .post("/api/users/signin")
        .send({
          email: "test@gmail.com",
          password: "hashedpswd",
        })
        .expect(200);

      expect(res.body).to.have.all.key("role", "token", "isSuccess", "message");
      expect(res.body.message).equal("signin success");
      expect(res.body.isSuccess).equal(true);
    });

    it("should return error message when email and password dont match", async () => {
      const res = await request(api)
        .post("/api/users/signin")
        .send({
          email: "test@gmail.com",
          password: "hashedpsd",
        })
        .expect(400);

      const { isSuccess } = res.body;
      expect(isSuccess).to.equal(false);
    });
  });
});
