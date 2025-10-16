import { AlertTriangle } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TokenMarketListCard from "./list";

interface TokenMarketPlace {
  router: AppRouterInstance;
}

function TokenMarketPlace({ router }: TokenMarketPlace) {
  return (
    <main className="w-full flex flex-col items-center">
      <TokenMarketListCard router={router} />

      {/* Under Maintenance message */}
      <div className="mt-8 flex flex-col items-center text-center">
        <AlertTriangle className="h-24 w-24 text-yellow-500 mb-4" />
        <span className="text-yellow-600 text-2xl font-semibold">
          Under Maintenance
        </span>
        <p className="text-gray-500 text-base mt-2">
          We're working hard to bring things back online.
        </p>
      </div>
    </main>
  );
}

export default TokenMarketPlace;
