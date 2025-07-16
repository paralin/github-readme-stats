import "@testing-library/jest-dom";
import { calculateRank } from "../src/calculateRank.js";
import { expect, it, describe } from "@jest/globals";

describe("Test calculateRank", () => {
  it("new user gets C rank", () => {
    expect(
      calculateRank({
        all_commits: false,
        commits: 0,
        prs: 0,
        issues: 0,
        reviews: 0,
        repos: 0,
        stars: 0,
        followers: 0,
      }),
    ).toStrictEqual({ level: "C", percentile: 100 });
  });

  it("beginner user gets B- rank", () => {
    const rank = calculateRank({
      all_commits: false,
      commits: 125,
      prs: 25,
      issues: 10,
      reviews: 5,
      repos: 0,
      stars: 25,
      followers: 5,
    });

    // round percentile to avoid floating point precision issues
    // not ceiling because we want to test the percentile value
    // round to nearest 0.0001
    rank.percentile = Math.round(rank.percentile * 10000) / 10000;

    expect(rank).toStrictEqual({ level: "B-", percentile: 65.0292 });
  });

  it("median user gets B+ rank", () => {
    expect(
      calculateRank({
        all_commits: false,
        commits: 250,
        prs: 50,
        issues: 25,
        reviews: 10,
        repos: 0,
        stars: 50,
        followers: 10,
      }),
    ).toStrictEqual({ level: "B+", percentile: 46.09375 });
  });

  it("average user gets B+ rank (include_all_commits)", () => {
    expect(
      calculateRank({
        all_commits: true,
        commits: 1000,
        prs: 50,
        issues: 25,
        reviews: 10,
        repos: 0,
        stars: 50,
        followers: 10,
      }),
    ).toStrictEqual({ level: "B+", percentile: 46.09375 });
  });

  it("advanced user gets A rank", () => {
    expect(
      calculateRank({
        all_commits: false,
        commits: 500,
        prs: 100,
        issues: 50,
        reviews: 20,
        repos: 0,
        stars: 200,
        followers: 40,
      }),
    ).toStrictEqual({ level: "A", percentile: 20.841471354166664 });
  });

  it("expert user gets A+ rank", () => {
    expect(
      calculateRank({
        all_commits: false,
        commits: 1000,
        prs: 200,
        issues: 100,
        reviews: 40,
        repos: 0,
        stars: 800,
        followers: 160,
      }),
    ).toStrictEqual({ level: "A+", percentile: 5.575988339442828 });
  });

  it("sindresorhus gets S rank", () => {
    expect(
      calculateRank({
        all_commits: false,
        commits: 1300,
        prs: 1500,
        issues: 4500,
        reviews: 1000,
        repos: 0,
        stars: 600000,
        followers: 50000,
      }),
    ).toStrictEqual({ level: "S", percentile: 0.4578556547153667 });
  });
});
