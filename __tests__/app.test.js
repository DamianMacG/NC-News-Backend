const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test("200: should respond with an object containing a key of topics with a value of an array of all the topic objects.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        expect(typeof body).toBe("object");
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics[0].slug).toBe("mitch");
        expect(
          body.topics.every((topic) => topic.hasOwnProperty("description"))
        ).toBe(true);
        body.topics.forEach((topic) =>
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          })
        );
      });
  });
  test("404: should respond with undefined for invalid endpoint", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(undefined);
      });
  });
});
