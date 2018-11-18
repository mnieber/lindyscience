// @flow

import Cookies from 'js-cookie'
import { request, GraphQLClient } from 'graphql-request'


function _createClient(authToken: ?string) {
  const tokenHeader = authToken
    ? {
      'Authorization': 'Token ' + authToken
    }
    : {};

  return new GraphQLClient(
    `/graphql`,
    {
      credentials: 'include',
      headers: {
        ...tokenHeader,
        "X-CSRFToken": Cookies.get('csrftoken')
      }
    }
  );
}

let _client = _createClient();

export const client = () => _client;
export const setToken = (token: string) => {_client = _createClient(token)};

export function doQuery(query: string, variables: any) {
  return client().request(query, variables);
}
