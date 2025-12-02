export const getImageUrl = (path?: string | null): string => {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://10.10.7.8:5002";
    return `${baseUrl}/${path}`;
  }
};
