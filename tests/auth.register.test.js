import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../src/app.js";
import { User } from "../src/models/User.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const validUser = {
  name: "Ada Student",
  email: "ada@example.com",
  password: "StrongPass123!"
};

describe("POST /api/auth/register", () => {
  test("registers a valid user with HTTP 201", async () => {
    const response = await request(app).post("/api/auth/register").send(validUser);
    expect(response.status).toBe(201);
  });

  test("stores a hashed password", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const stored = await User.findOne({ email: validUser.email });
    expect(stored.password).not.toBe(validUser.password);
    expect(await bcrypt.compare(validUser.password, stored.password)).toBe(true);
  });

  test("does not return a password field", async () => {
    const response = await request(app).post("/api/auth/register").send(validUser);
    expect(response.body.user).not.toHaveProperty("password");
  });

  test.each([
    ["name", { email: validUser.email, password: validUser.password }],
    ["email", { name: validUser.name, password: validUser.password }],
    ["password", { name: validUser.name, email: validUser.email }]
  ])("returns HTTP 400 when %s is missing", async (_field, payload) => {
    const response = await request(app).post("/api/auth/register").send(payload);
    expect(response.status).toBe(400);
  });

  test("returns HTTP 400 for an invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, email: "not-an-email" });
    expect(response.status).toBe(400);
  });

  test("returns HTTP 409 for a duplicate email", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const response = await request(app).post("/api/auth/register").send(validUser);
    expect(response.status).toBe(409);
  });

  test("prevents role injection", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, role: "admin" });

    const stored = await User.findOne({ email: validUser.email });
    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe("user");
    expect(stored.role).toBe("user");
  });
});
