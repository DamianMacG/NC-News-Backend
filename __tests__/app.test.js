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

describe("ALL non-existent path", () => {
  test("404: should return a custom error message when path not found", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
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
        body.topics.forEach((topic) =>
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          })
        );
      });
  });
  test("404: should respond with 'Not found' for invalid endpoint", () => {
    return request(app).get("/api/banana").expect(404);
  });
});

describe("GET /api", () => {
  test("200 should respond with a JSON object of available endpoints", () => {
    const endpoints = require("../endpoints.json");
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 should respond with the article object for a valid article ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("404 should respond with an error message for a non-existent article ID", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
  test("400 should respond with an error message for an invalid ID endpoint", () => {
    return request(app)
      .get("/api/articles/invalidId")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad request" });
      });
  });
});
