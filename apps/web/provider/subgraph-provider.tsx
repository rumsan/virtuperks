"use client";

import { Client } from "@urql/core";
import { SubgraphService } from "@workspace/subgraph";
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
  const urqlClient = new Client({
    url: "http://localhost:8000",
    exchanges: [],
  });
  return (
    <GraphContext.Provider
      value={{
        queryService: new SubgraphService(urqlClient),
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export const useGraphService = (): GraphContextType => {
  return useContext(GraphContext) as GraphContextType;
};
