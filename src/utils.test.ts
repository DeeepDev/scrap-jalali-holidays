import { addLeadingZeroIfSingle, compareLocalDate, createDatesArr } from "./utils";

describe("compareLocalDate", () => {
  it("should return -1 when date1 = { year: 1392, month: 6 } and date2 = { year: 1392, month: 8 }", () => {
    expect(compareLocalDate({ year: 1392, month: 6 }, { year: 1392, month: 8 })).toBe(-1);
  });

  it("should return 1 when date1 = { year: 1393, month: 8 } and date2 = { year: 1392, month: 8 }", () => {
    expect(compareLocalDate({ year: 1393, month: 8 }, { year: 1392, month: 8 })).toBe(1);
  });

  it("should return 0 when date1 = { year: 1392, month: 8 } and date2 = { year: 1392, month: 8 }", () => {
    expect(compareLocalDate({ year: 1392, month: 8 }, { year: 1392, month: 8 })).toBe(0);
  });
});

describe("createDatesArr", () => {
  it("should return correct output when month values are equal", () => {
    expect(createDatesArr({ from: { year: 1391, month: 8 }, to: { year: 1392, month: 8 } })).toEqual([
      { year: 1391, month: 8 },
      { year: 1391, month: 9 },
      { year: 1391, month: 10 },
      { year: 1391, month: 11 },
      { year: 1391, month: 12 },
      { year: 1392, month: 1 },
      { year: 1392, month: 2 },
      { year: 1392, month: 3 },
      { year: 1392, month: 4 },
      { year: 1392, month: 5 },
      { year: 1392, month: 6 },
      { year: 1392, month: 7 },
      { year: 1392, month: 8 },
    ]);
  });

  it("should return correctly - 1", () => {
    expect(createDatesArr({ from: { year: 1392, month: 4 }, to: { year: 1392, month: 6 } })).toEqual([
      { year: 1392, month: 4 },
      { year: 1392, month: 5 },
      { year: 1392, month: 6 },
    ]);
  });

  it("should return correctly - 2", () => {
    expect(createDatesArr({ from: { year: 1392, month: 6 }, to: { year: 1392, month: 6 } })).toEqual([
      { year: 1392, month: 6 },
    ]);
  });

  it("should return empty array when from is after to date", () => {
    expect(createDatesArr({ from: { year: 1392, month: 7 }, to: { year: 1392, month: 6 } })).toEqual([]);
  });
});

describe("addLeadingZeroIfSingle", () => {
  it("should give 01 when input is 1", () => {
    expect(addLeadingZeroIfSingle(1)).toBe("01");
  });

  it("should give 12 when input is 12", () => {
    expect(addLeadingZeroIfSingle(12)).toBe("12");
  });

  it("should give 1384 when input is 1384", () => {
    expect(addLeadingZeroIfSingle(1384)).toBe("1384");
  });
});
