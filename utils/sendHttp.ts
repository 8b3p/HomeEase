/**
 *
 * @param {string} url
 * @param {string} method
 * @param {obj} body
 * @param {obj} headers
 * @returns {Promise<{res: any, error: any}>}
 */

interface badResponse {
  res: null;
  error: {
    message: string;
    status: number;
  };
}
interface goodResponse<T = any> {
  res: T;
  error: null;
}
interface sendHttpProps {
  url: string;
  method: string;
  body?: object;
  headers?: HeadersInit;
}

export function generic<T>(name: T): T {
  return name;
}

export const sendHttp = async <
  Res = any,
  Args extends sendHttpProps = sendHttpProps
>({
  url,
  method,
  headers,
  body,
}: Args): Promise<goodResponse<Res> | badResponse> => {
  try {
    const response = await fetch("http://localhost:3000/api/" + url, {
      method: method,
      headers: headers ? headers : { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const responseData = (await response.json()) as Res;
      return { res: responseData, error: null };
    } else if (response.status === 401) {
      return {
        error: { message: "Unauthorized", status: response.status },
        res: null,
      };
    } else if (response.status === 404) {
      return {
        error: { message: "Not Found", status: response.status },
        res: null,
      };
    } else if (response.status === 500) {
      return {
        error: { message: "Server Error", status: response.status },
        res: null,
      };
    } else if (response.status === 400) {
      return {
        error: { message: "Bad Request", status: response.status },
        res: null,
      };
    } else if (response.status === 403) {
      return {
        error: { message: "Forbidden", status: response.status },
        res: null,
      };
    } else if (response.status === 409) {
      return {
        error: { message: "Conflict", status: response.status },
        res: null,
      };
    } else if (response.status === 422) {
      return {
        error: { message: "Unprocessable Entity", status: response.status },
        res: null,
      };
    } else if (response.status === 429) {
      return {
        error: { message: "Too Many Requests", status: response.status },
        res: null,
      };
    } else if (response.status === 503) {
      return {
        error: { message: "Service Unavailable", status: response.status },
        res: null,
      };
    } else if (response.status === 504) {
      return {
        error: { message: "Gateway Timeout", status: response.status },
        res: null,
      };
    } else if (response.status === 505) {
      return {
        error: {
          message: "HTTP Version Not Supported",
          status: response.status,
        },
        res: null,
      };
    } else if (response.status === 511) {
      return {
        error: {
          message: "Network Authentication Required",
          status: response.status,
        },
        res: null,
      };
    }
    const responseData = await response.json();
    return {
      error: { message: responseData.error, status: response.status },
      res: null,
    };
  } catch (error: any) {
    return { error: { message: error.message, status: 0 }, res: null };
  }
};
