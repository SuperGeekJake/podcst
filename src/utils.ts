const mockElement = document.createElement("div");
export const getTextContent = (htmlStr: string | null | undefined) => {
  if (!htmlStr) return "";
  mockElement.innerHTML = htmlStr;
  return mockElement.textContent || "";
};

export const minMax = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(num, max));

export const generateClass = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

export const createMouseElement = (x: number = 0, y: number = 0) => ({
  getBoundingClientRect: () => ({
    x,
    y,
    top: y,
    left: x,
    bottom: y,
    right: x,
    width: 0,
    height: 0,
  }),
});
