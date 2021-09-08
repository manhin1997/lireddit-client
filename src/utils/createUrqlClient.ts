import { dedupExchange, fetchExchange, Exchange, stringifyVariables } from "urql";
import {pipe, tap } from 'wonka';
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql";
import { betterupdateQuery } from "./betterupdateQuery";
import {cacheExchange, Resolver} from '@urql/exchange-graphcache';
import Router from 'next/router';

export const createUrqlClient = ((ssrExchange : any) => ({
    url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [dedupExchange, cacheExchange({
    keys:{
      PaginatedPosts: () => null,
    },
    resolvers: {
      Query: {
        posts: cursorPagination(),
      }
    },
    updates: {
      Mutation: {
        login : (_result, args, cache, info) => {
          betterupdateQuery<LoginMutation, MeQuery>(cache, {query: MeDocument}
            , _result, (result , query) => {
              if(result.login.errors){
                return query
              } else {
                return {
                  me: result.login.user,
                }
              }
            })
        },
        register : (_result, args, cache, info) => {
          betterupdateQuery<RegisterMutation, MeQuery>(cache, {query: MeDocument}
            , _result, (result , query) => {
              if(result.register.errors){
                return query
              } else {
                return {
                  me: result.register.user,
                }
              }
            })
        },
        logout : (_result, args, cache, info) => {
          betterupdateQuery<LogoutMutation, MeQuery>(cache, {query: MeDocument}
            , _result, (result , query) => {
              if(result.logout){
                return {me : null}
              }
              return query
            })
        }

      }
    }
  }),ssrExchange, errorExchange ,fetchExchange]
}));


const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    info.partial = true;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if(error.message.includes("not authenticated")){
          Router.replace("/login");
        }
      }
    })
  );
};

