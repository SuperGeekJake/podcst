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

export const createMouseElement = (
  clientX: number = 0,
  clientY: number = 0
) => ({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    x: clientX,
    y: clientY,
    top: clientY,
    left: clientX,
    right: clientX,
    bottom: clientY,
  }),
});
