const request = require("supertest");
const app = require("./app");
const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const testData = require("./db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: response with 200 status code and returns all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toMatchObject([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });

  test("404: response with default 404 status code when given invalid extra path", () => {
    return request(app)
      .get("/api/topics/invalid-extra")
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({});
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: response with 200 status code and returns article given ID", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toMatchObject({
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
  test("404: response with 404 status code and returns error message if article_id not found", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: response with 400 status code and returns error message if bad request made", () => {
    return request(app)
      .get("/api/articles/non-valid-request")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api", () => {
  test("200: response with 200 status code and returns list of all apis", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toMatchObject({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
        });
        for (key in body.endpoints) {
          expect(body.endpoints[key]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            exampleResponse: expect.any(Object),
          });
        }
      });
  });
});

describe("GET /api/articles", () => {
  test("200: response with 200 status code and returns array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        expect(body.articles).toBeSorted({
          descending: true,
          key: "created_at",
        });
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("404: response with default 404 status code when given invalid extra path", () => {
    return request(app)
      .get("/api/articles/invalid-extra")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: response with 200 status code and returns array of all comments for a specified article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((article) => {
          expect(article).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: response with 200 status code and returns empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("404: response with 404 status code and returns msg not found if article does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("not found");
      });
  });
  test("400: response with 400 status code and returns msg bad request if article_id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: response with 201 status code, inserts comment given article_id and responds with posted comment", () => {
    const input = {
      body: "test body",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.comments).toMatchObject({
          body: "test body",
          author: "butter_bridge",
          comment_id: expect.any(Number),
          article_id: 1,
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("400: response with 400 status code and responds with bad request if missing body or author input", () => {
    const input = {
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and responds with bad request if author is not an existing user", () => {
    const input = {
      body: "test body",
      author: "not a user",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and responds with bad request if article_id does not exist", () => {
    const input = {
      body: "test body",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and responds with bad request if article_id is invalid", () => {
    const input = {
      body: "test body",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/invalid-article_id/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
