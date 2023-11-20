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
        console.log(body.articles, "body");
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            //add comment count,
            //sort by default of date in descending order
          });
        });
      });
  });
});
/* 
.then(({ body }) => {
        expect(body.treasures).toHaveLength(26);
        body.treasures.forEach((treasure) => {
          expect(treasure).toMatchObject({
            treasure_id: expect.any(Number),
            treasure_name: expect.any(String),
            colour: expect.any(String),
            age: expect.any(Number),
            cost_at_auction: expect.any(Number),
            shop_id: expect.any(Number),
          });
        });
        expect(body.treasures).toBeSortedBy("treasure_id");
      });*/
/*Should:

be available on /api/articles.
get all articles.
Responds with:

an articles array of article objects, each of which should have the following properties:
author
title
article_id
topic
created_at
votes
article_img_url
comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.
In addition:

the articles should be sorted by date in descending order.
there should not be a body property present on any of the article objects.
Consider what errors could occur with this endpoint, and make sure to test for them.

Remember to add a description of this endpoint to your /api endpoint.*/
