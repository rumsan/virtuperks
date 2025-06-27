"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

interface LoaderSkeletonProps {
  backButton?: boolean;
  tabsCount?: number;
  title?: boolean;
  titleWidth?: string;
  subtitle?: boolean;
  subtitleWidth?: string;
  toolbar?: boolean;
  toolbarHeight?: string;
  cardCount?: number;
  gridCols?: string;
  cardHeight?: string;
  rowCount?: number;
  rowHeight?: string;
  showPagination?: boolean;
  showTabs?: boolean;
  showCreateButton?: boolean;
  showDatePicker?: boolean;
  tableSkeleton?: boolean;
  tableHeight?: string;
}

const LoaderSkeleton = ({
  backButton = false,
  tabsCount = 0,
  title = true,
  titleWidth = "w-48",
  subtitle = true,
  subtitleWidth = "w-64",
  toolbar = false,
  toolbarHeight = "h-10",
  cardCount = 6,
  gridCols = "grid-cols-3",
  cardHeight = "h-40",
  rowCount = 0,
  rowHeight = "h-12",
  showPagination = false,
  showTabs = false,
  showCreateButton = false,
  showDatePicker = false,
  tableSkeleton = false,
  tableHeight = "h-64",
}: LoaderSkeletonProps) => {
  return (
    <main
      className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full flex flex-col"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="space-y-4 flex-grow">
        {/* 1. Back button */}
        {backButton && <Skeleton className="w-12 h-8 rounded-md mb-2" />}

        {/* 2. Title & Subtitle */}
        <div className="flex flex-col gap-1 my-3">
          {title && <Skeleton className={cn("h-10", titleWidth)} />}
          {subtitle && <Skeleton className={cn("h-4", subtitleWidth)} />}
        </div>

        {/* 3. Tabs */}
        {(showTabs || tabsCount > 0) && (
          <div className="flex gap-2 mb-3">
            {Array.from({ length: tabsCount || 2 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-md" />
            ))}
          </div>
        )}

        {showCreateButton && (
          <div className="mb-3 flex justify-end">
            <Skeleton className="h-10 w-[10rem] rounded-md" />
          </div>
        )}

        {/* 4. Toolbar elements (filters) */}
        {showDatePicker && (
          <div className="mb-3 flex justify-end">
            <Skeleton className="h-10 w-[200px] rounded-md" />
          </div>
        )}

        {toolbar && (
          <Skeleton className={cn(toolbarHeight, "w-full rounded-md mb-4")} />
        )}

        {/* 5. Card grid (summary boxes) */}
        {cardCount > 0 && (
          <div className={cn("grid gap-4", gridCols)}>
            {Array.from({ length: cardCount }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn("w-full rounded-lg", cardHeight)}
              />
            ))}
          </div>
        )}
        {/* Connected table skeleton rectangle */}
        {tableSkeleton && (
          <Skeleton
            className={cn("w-full rounded-md", tableHeight || "h-64")}
          />
        )}

        {/* 6. Table/list rows */}
        {rowCount > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            {Array.from({ length: rowCount }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn("w-full rounded-md", rowHeight)}
              />
            ))}
          </div>
        )}

        {/* 7. Pagination */}
        {showPagination && (
          <div className="mt-5 mb-5">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        )}
      </div>
    </main>
  );
};

export default LoaderSkeleton;
