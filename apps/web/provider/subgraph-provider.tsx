"use client";

// import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { SubgraphService } from "@workspace/subgraph";
import { createContext, useContext } from "react";
import { cacheExchange, Client, fetchExchange } from "urql";

export type GraphContextType = {
  queryService: SubgraphService | null;
};
export const GraphContext = createContext<GraphContextType | null>({
  queryService: null,
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function GraphQueryProvider({ children }: QueryProviderProps) {
  // const urqlClient = new Client({
  //   url: "http://localhost:8000/subgraphs/name/virtuperks/graphql",
  //   exchanges: [cacheExchange, fetchExchange],
  // });
  // console.log(urqlClient, "urqlClient");
  // const subgraphService = new SubgraphService( // No need to create urqlClient here
  //   "http://localhost:8000/subgraphs/name/virtuperks/graphql",
  // );
  const url = "http://localhost:8000/subgraphs/name/virtuperks/graphql";
  const subgraphService = new Client({
    url,
    exchanges: [cacheExchange, fetchExchange],
  });

  return (
    <GraphContext.Provider
      value={{
        queryService: new SubgraphService(subgraphService),
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export const useGraphService = (): GraphContextType => {
  //return useContext(GraphContext) as GraphContextType;
  const context = useContext(GraphContext) as GraphContextType;

  if (context === undefined) {
    throw new Error("useGraphService must be used within a GraphQueryProvider");
  }
  return context;
};
