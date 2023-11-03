function validURL(str: string | undefined) {
  if (!str) {
    return false;
  }
  return !!new RegExp(/^(https?):\/\/[^\s$.?#].[^\s]*$/gi).test(str);
}

export const BASE_URL =
  process.env.REACT_APP_API_BASE_URL && validURL(process.env.REACT_APP_API_BASE_URL)
    ? new URL(process.env.REACT_APP_API_BASE_URL).pathname
    : process.env.REACT_APP_API_BASE_URL || '';

export const SESSION_DETAILS = 'session/:id';

export const getSessionDetailsUrl = (id: string) => {
  return `${BASE_URL}/session/${id}`;
};

export const getBaseUrl = () => {
  return `${BASE_URL}`;
};
