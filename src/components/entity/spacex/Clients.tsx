import { QueryClient } from 'react-query';
import { GraphQLClient } from 'graphql-request';

export const queryClient = new QueryClient();
export const graphqlClient = new GraphQLClient('https://api.spacex.land/graphql/');
