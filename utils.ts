export const getExtension = (filename: string): string => {
  const splitArray = filename.split(".");
  return splitArray?.[splitArray.length - 1] || "";
};
