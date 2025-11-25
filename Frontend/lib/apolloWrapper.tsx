'use client'
import { ApolloNextAppProvider, ApolloClient, InMemoryCache, SSRMultipartLink } from '@apollo/client-integration-nextjs'
import { HttpLink } from '@apollo/client'
import { apiUrl } from './api'
function makeClient() {
  const httpLink = new HttpLink({ uri: `${apiUrl}/graphql` })
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: typeof window === 'undefined' ? new SSRMultipartLink({ stripDefer: true }).concat(httpLink) : httpLink
  })
}
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}