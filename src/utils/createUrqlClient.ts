import { dedupExchange, fetchExchange, Exchange } from "urql";
import {pipe, tap } from 'wonka';
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql";
import { betterupdateQuery } from "./betterupdateQuery";
import {cacheExchange} from '@urql/exchange-graphcache';
import Router from 'next/router';

export const createUrqlClient = ((ssrExchange : any) => ({
    url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [dedupExchange, cacheExchange({
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

  export const errorExchange: Exchange = ({ forward }) => ops$ => {
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

