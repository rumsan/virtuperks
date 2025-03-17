"use client";

import { SubgraphService } from "@workspace/subgraph/service";
import { createContext, useContext } from "react";

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
  const graphql = "http://localhost:8000/subgraphs/name/virtuperks";
 // const graphql = "https://api.studio.thegraph.com/query/101438/reward-test/version/latest";

  return (
    <GraphContext.Provider
      value={{
        queryService: new SubgraphService(graphql),
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
