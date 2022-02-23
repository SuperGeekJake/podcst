import { formatDuration } from "./formatting";

describe("formatDuration", () => {
  test("returns the correct message for seconds", () => {
    expect(formatDuration(36)).toBe("0:36");
  });

  test("returns the correct message for minutes", () => {
    expect(formatDuration(139)).toBe("2:19");
  });

  test("returns the correct message for hours", () => {
    expect(formatDuration(6609)).toBe("1:50:09");
  });
});
