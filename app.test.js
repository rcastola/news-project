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
        expect(body.articles).toHaveLength(10);
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
        expect(body.comments).toHaveLength(10);
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

describe("POST /api/articles/:article_id/comments - post a comment on an article", () => {
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
describe("PATCH /api/articles/:article_id- updates the vote key on an article object given article_id", () => {
  test("200: response with 200 status code, increases the votes key of a specific article and returns updated article ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 105,
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: response with 200 status code, decreases the votes key of a specific article and returns updated article ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          created_at: expect.any(String),
          votes: 95,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: response with 404 status code and msg not found when given non-existing article_id", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("not found");
      });
  });
  test("400: response with 404 status code and msg bad request when given invalid article_id", () => {
    return request(app)
      .patch("/api/articles/invalid-id")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("400: response with 400 status code and msg bad request when given empty inc_votes object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("400: response with 400 status code and msg bad request when given inc_votes object containing data type that is invalid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "invalid vote change" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204 - delete correct ride given id in url", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404 - responds with 404 status code given non-existing comment_id", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400 - responds with 400 status code given invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalid-comment_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("GET /api/users", () => {
  test("200 - returns array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api/articles?topic=query", () => {
  test("200 - returns array of all articles with topic specified in query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: "2",
          });
        });
      });
  });
  test("404 - responds with 404 status code given invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=invalid-topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("200 - responds with 200 and array of all articles if no topic provided in query", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
      });
  });
  test("200 - responds with 200 status code  and returns empty array given a topic query that has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});

describe("GET /api/articles/:article_id- add comment count", () => {
  test("200 - returns array of a specified article which also includes a comment count", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveProperty("comment_count", "2");
      });
  });
  test("200 - returns array of a specified article with comment count of 0 if no comments on given article", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveProperty("comment_count", "0");
      });
  });
});

describe("GET /api/articles/- sort_by and order features", () => {
  test("200 - returns array of articles sorted by given valid value in default descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          key: "article_id",
          descending: true,
        });
      });
  });
  test("200 - returns array of articles sorted by given valid sort_by value in default descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({ key: "title", descending: true });
      });
  });
  test("400 - returns status code 400 and msg bad request if sort_by value is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("200 - returns array of articles sorted by valid sort_by value in a given order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=DESC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          key: "article_id",
          descending: true,
        });
      });
  });
  test("200 - returns array of articles sorted by default sort_by value (created_at) in a given order if no sort_by value given", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({
          key: "created_at",
          ascending: true,
        });
      });
  });
  test("400 - returns status code 400 and msg bad request if order value is invalid", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users/:username- get a user by username", () => {
  test("200 - returns a user object given a username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: response with 404 status code and returns error message if username not found", () => {
    return request(app)
      .get("/api/users/non-existing-user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id- update the votes on a comment given the comment_id", () => {
  test("200: response with 200 status code, increases the votes key of a specific comment and returns updated comment ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 21,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });
  test("200: response with 200 status code, decreases the votes key of a specific comment and returns updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 11,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });
  test("404: response with 404 status code and msg not found when given non-existing comment_id", () => {
    return request(app)
      .patch("/api/comments/999")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("not found");
      });
  });
  test("400: response with 400 status code and msg bad request when given invalid comment_id", () => {
    return request(app)
      .patch("/api/comments/invalid-id")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("400: response with 400 status code and msg bad request when given empty inc_votes object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("400: response with 400 status code and msg bad request when given inc_votes object containing data type that is invalid", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "invalid vote change" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
});

describe("POST /api/articles - post an article", () => {
  test("201: response with 201 status code, inserts comment given article_id and responds with posted comment", () => {
    const input = {
      title: "Example",
      topic: "mitch",
      author: "butter_bridge",
      body: "Example",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          title: "Example",
          topic: "mitch",
          author: "butter_bridge",
          body: "Example",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("201: response with 201 status code, inserts comment given article_id and responds with posted comment and default article_img_url if not provided in input", () => {
    const input = {
      title: "Example",
      topic: "mitch",
      author: "butter_bridge",
      body: "Example",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: expect.any(Number),
          title: "Example",
          topic: "mitch",
          author: "butter_bridge",
          body: "Example",
          article_img_url: "no img url provided",
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
  test("400: response with 400 status code and responds with bad request if missing a required field in input", () => {
    const input = {
      title: "Example",
      topic: "mitch",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and responds with bad request if author is not an existing author", () => {
    const input = {
      title: "Example",
      topic: "mitch",
      author: "not an existing author",
      body: "Example",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and responds with bad request if topic is not an existing topic", () => {
    const input = {
      title: "Example",
      topic: "not an existing topic",
      author: "butter_bridge",
      body: "Example",
    };
    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles?limit=X&p=X- add pagination feature for articles", () => {
  test("200 - returns array of articles included within limit provided and on 1st page", () => {
    return request(app)
      .get("/api/articles?limit=5&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(5);
        expect(body.total_count).toBe(5);
      });
  });
  test("200 - returns array of articles included within limit provided and on 2nd page", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(5);
        expect(body.total_count).toBe(5);
      });
  });
  test("200 - returns array of articles included within limit provided and on 3rd page", () => {
    return request(app)
      .get("/api/articles?limit=5&p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(3);
        expect(body.total_count).toBe(3);
      });
  });
  test("400: response with 400 status code and returns error message if invalid limit value given ", () => {
    return request(app)
      .get("/api/articles?limit=invalid&p=3")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and returns error message if page number given exceeds max page number ", () => {
    return request(app)
      .get("/api/articles?limit=5&p=99")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and returns error message if invalid page number given ", () => {
    return request(app)
      .get("/api/articles?limit=5&p=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments?limit=X&p=X, add pagination feature for comments", () => {
  test("200 - returns array of articles included within limit provided and on 1st page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(5);
      });
  });
  test("200 - returns array of articles included within limit provided and on 2nd page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(5);
      });
  });
  test("200 - returns array of articles included within limit provided and on 3rd page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(1);
      });
  });
  test("400: response with 400 status code and returns error message if invalid limit value given ", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=invalid&p=3")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and returns error message if page number given exceeds max page number ", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=99")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and returns error message if invalid page number given ", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/topics- post a new topic", () => {
  test("201: response with 201 status code, inserts new topic and responds with posted topic", () => {
    const input = {
      slug: "topic name here",
      description: "description here",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toMatchObject({
          slug: "topic name here",
          description: "description here",
        });
      });
  });
  test("400: response with 400 status code and responds with bad request if missing essential input of slug ", () => {
    const input = {
      description: "description here",
    };
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: response with 400 status code and responds with bad request if input is an empty object", () => {
    const input = {};
    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
