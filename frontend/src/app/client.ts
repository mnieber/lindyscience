import Cookies from 'js-cookie';
import { GraphQLClient } from 'graphql-request';

function _createClient() {
  const authToken = Cookies.get('authToken');

  return new GraphQLClient(`http://localhost:8000/graphql/`, {
    headers: authToken
      ? {
          Authorization: 'Token ' + authToken,
        }
      : {},
  });
}

let _client = _createClient();

export const client = () => _client;
export const setToken = (authToken: string) => {
  Cookies.set('authToken', authToken);
  _client = _createClient();
};

export function doQuery(query: string, variables: any) {
  return client().request(query, variables);
}
