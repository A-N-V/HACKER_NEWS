import axios from "axios";

type RequestMethod = "GET" | "POST";

type RequestOptions = {
  url: string;
  params: { [key: string]: string };
  method?: RequestMethod;
};

export const postRequest = ({ url, params, method = "GET" }: RequestOptions) => {
  if (method === "GET") {

    const queryParams = Object.entries(params);
    const res = <string[]>[];

    queryParams.forEach((query) => {
      res.push(query.join("="));
    });

    const urlWithParams = `${url + "?" + res.join("&")}`;

    return axios.get<number[]>(urlWithParams);
  }
};
