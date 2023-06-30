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
        expect(body.article).toMatchObject({
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
  test("200 should respond with the article object and comment_count as 0 for an article with no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe(0);
        expect(body.article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
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

describe("GET /api/articles", () => {
  test("200: should return an array or article objects (without body property) in descending order by created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(typeof body).toBe("object");
        expect(Array.isArray(body.articles)).toBe(true);
        body.articles.forEach((article) =>
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
        expect(body.articles[12]).toEqual({
          article_id: 7,
          title: "Z",
          author: "icellusedkars",
          topic: "mitch",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("should return articles filtered by topic when 'topic' query parameter is provided", () => {
    const topic = "cats";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles[0]).toMatchObject({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          author: "rogersop",
          topic: "cats",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });
  test("should return empty array when topic is valid but not found", () => {
    const topic = "paper";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles).toEqual([]);
      });
  });

  test("should return articles sorted by the specified column and in the specified order", () => {
    const sort_by = "votes";
    const order_by = "ASC";
    return request(app)
      .get(`/api/articles?sort_by=${sort_by}&order_by=${order_by}`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(13);
        expect(body.articles[0]).toMatchObject({
          article_id: 12,
          title: "Moustache",
          author: "butter_bridge",
          topic: "mitch",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("should return articles in the specified order when 'order' query parameter is provided - ASC", () => {
    return request(app)
      .get(`/api/articles?order_by=ASC`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(13);
        expect(body.articles[0]).toMatchObject({
          article_id: 7,
          title: "Z",
          author: "icellusedkars",
          topic: "mitch",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });
  test("should return articles in the specified order when 'order' query parameter is provided - DESC", () => {
    return request(app)
      .get(`/api/articles?created_at=DESC`)
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(13);
        expect(body.articles[0]).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          author: "icellusedkars",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });
  test("should return 400 Bad Request when an invalid sort_by value is provided", () => {
    return request(app)
      .get(`/api/articles?sort_by=banana`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort value");
      });
  });
  test("should return 400 Bad Request when an invalid order value is provided", () => {
    return request(app)
      .get(`/api/articles?order_by=banana`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order value");
      });
  });
  test("should return 404 when querying by a topic that doesn't exist", () => {
    const topic = "banana";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with an array of comments for the article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        expect(Array.isArray(body.comments)).toBe(true);
        body.comments.forEach((comment) =>
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          })
        );
        expect(body.comments).toEqual([
          {
            comment_id: 11,
            body: "Ambidextrous marsupial",
            article_id: 3,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-09-19T23:10:00.000Z",
          },
          {
            comment_id: 10,
            body: "git push origin master",
            article_id: 3,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-06-20T07:24:00.000Z",
          },
        ]);
      });
  });
  test("200: should return an empty array if article id exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("404: should respond with error message if article id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
  test("400 should respond with an error message for an invalid ID endpoint", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad request" });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should add a comment for a valid article ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "The cutest man in all of the land!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "The cutest man in all of the land!",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("201: should add a comment for a valid article ID and ignore extra property inputs", () => {
    const newComment = {
      username: "butter_bridge",
      body: "The cutest man in all of the land!",
      votes: 100,
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "The cutest man in all of the land!",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("404: should respond with an error message for a non-existent article ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "All about the French!",
    };

    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
  test("404: should respond with an error message for a non-existent username", () => {
    const newComment = {
      username: "Beyonce",
      body: "All the single ladies",
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Username not found" });
      });
  });

  test("400: should respond with an error message for an invalid ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "All about the French!",
    };

    return request(app)
      .post("/api/articles/bananas/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad request" });
      });
  });
  test("400: should respond with an error message for missing required fields", () => {
    const newComment = {
      username: "Frodo Baggins",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Missing username or body",
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should update the votes property of an article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("200: should decrement the votes property of an article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: should respond with an error message for an invalid vote increment value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Invalid vote increment value" });
      });
  });

  test("404: should respond with an error message for a non-existent article ID", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article not found" });
      });
  });
});

describe("GET /api/users", () => {
  test("200: should respond with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(body.users[0]).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/comments/1")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ msg: "Not found" });
          });
      });
  });

  test("404: should respond with an error message for a non-existent comment ID", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Comment not found" });
      });
  });

  test("400: should respond with an error message for an invalid comment ID", () => {
    return request(app)
      .delete("/api/comments/invalidId")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad request" });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200 should respond with the user object for a valid username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toHaveProperty("username");
        expect(body.user).toHaveProperty("avatar_url");
        expect(body.user).toHaveProperty("name");
      });
  });

  test("404 should respond with an error message for a invalid/non-existent username", () => {
    return request(app)
      .get("/api/users/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "User not found" });
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200 should respond with the updated comment object for a valid comment_id and positive inc_votes", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment.votes).toBe(26);
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 26,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });

  test("200 should respond with the updated comment object for a valid comment_id and negative inc_votes", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment.votes).toBe(6);
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 6,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });

  test("404 should respond with an error message for a non-existent comment_id", () => {
    return request(app)
      .patch("/api/comments/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Comment not found" });
      });
  });

  test("400 should respond with an error message for missing inc_votes property", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad request - Invalid inc_votes value" });
      });
  });

  test("400 should respond with an error message for invalid inc_votes value", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad request - Invalid inc_votes value" });
      });
  });
});

// describe("POST /api/articles", () => {
//   test("201 should respond with the newly added article", () => {
//     return request(app)
//       .post("/api/articles")
//       .send({
//         author: "TestUser",
//         title: "Test Article",
//         body: "This is a test article.",
//         topic: "Test Topic",
//         article_img_url:
//           "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/10/Gandalf-Name-Feature-Image.jpg",
//       })
//       .expect(201)
//       .then(({ body }) => {
//         expect(body.article).toEqual({
//           author: "TestUser",
//           title: "Test Article",
//           body: "This is a test article.",
//           topic: "Test Topic",
//           article_img_url:
//             "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/10/Gandalf-Name-Feature-Image.jpg",
//           article_id: expect.any(Number),
//           votes: 0,
//           created_at: expect.any(String),
//           comment_count: 0,
//         });
//       });
//   });
// });
