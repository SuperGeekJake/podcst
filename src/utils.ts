const mockElement = document.createElement("div");
export const getTextContent = (htmlStr: string | null | undefined) => {
  if (!htmlStr) return "";
  mockElement.innerHTML = htmlStr;
  return mockElement.textContent || "";
};
