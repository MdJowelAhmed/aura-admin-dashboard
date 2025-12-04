export const getImageUrl = (path?: string | null): string => {
  if (!path || typeof path !== "string") {
    return "";
  }

  // If it's a local preview (blob URL)
  if (path.startsWith("blob:")) {
    return path;
  }

  // If it's already a full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Otherwise, it's a server file path
  const baseUrl = "http://10.10.7.8:5002";
  return `${baseUrl}/${path}`;
};
