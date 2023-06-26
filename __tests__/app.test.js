const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { getEndpoints } = require("../controllers/api.controller");

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

const generateEndpointObject = () => {
  const endpoints = require("../endpoints.json");
  const expectedResponse = {};

  for (const endpoint in endpoints) {
    expectedResponse[endpoint] = {
      ...endpoints[endpoint],
    };
  }

  return expectedResponse;
};

describe("GET /api", () => {
  test("200 should respond with a JSON object of available endpoints", () => {
    const expectedResponse = generateEndpointObject();

    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expectedResponse);
      });
  });
});
