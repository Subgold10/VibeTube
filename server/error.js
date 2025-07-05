export const createError = (statusCode, errorMessage) => {
  const customError = new Error();
  customError.status = statusCode;
  customError.message = errorMessage;
  return customError;
};
