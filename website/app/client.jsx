// @flow

import Cookies from "js-cookie";
import { request, GraphQLClient } from "graphql-request";

function _createClient() {
  const authToken = Cookies.get("authToken");
  const authHeader = authToken
    ? {
        Authorization: "Token " + authToken,
      }
    : {};

  return new GraphQLClient(`/graphql`, {
    credentials: "include",
    headers: {
      ...authHeader,
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });
}

let _client = _createClient();

export const client = () => _client;
export const setToken = (authToken: string) => {
  Cookies.set("authToken", authToken);
  _client = _createClient();
};

export function doQuery(query: string, variables: any) {
  return client().request(query, variables);
}
