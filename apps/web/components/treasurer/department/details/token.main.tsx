import {
  useCheckTotalAllocatedTokens,
  useCheckTotalUnallocatedTokens,
  useGetEntityById,
  useGetEntityOwners,
} from "@/hooks/subgraph/entity";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { toast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft, Coins, Copy, User } from "lucide-react";
import TokenAllocateForm from "../form/token.allocate";

interface TokenCreateMainProps {
  id: { id: string };
}

const TokenCreateMain = ({ id }: TokenCreateMainProps) => {
  console.log("TokenCreateMain Params:", id);
  const { data: entity, isLoading, isError, error } = useGetEntityById(id.id);
  console.log("Entity Data:", entity);

  const { unallocatedTokens } = useCheckTotalUnallocatedTokens(
    entity?.rewardManagement,
  );

  const { totalAllocatedTokens } = useCheckTotalAllocatedTokens(
    entity?.rewardManagement,
  );
  const { getEntityOwners } = useGetEntityOwners(entity?.entityId);

  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
      <div
        className="w-[170px] flex justify-center items-center gap-2 cursor-pointer"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
          history.back();
        }}
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>

      {/* <div
        onClick={() => router.push(PATHS.TREASURER.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400 "
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div> */}
      <div className="flex flex-col gap-1 my-2">
        <h1 className="font-bold text-4xl">Create Token</h1>
        <h3 className="text-gray-500 font-normal text-sm">
          Fill the form below to create token details
        </h3>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-4 w-full">
        <Card className="font-normal text-base h-50 flex flex-col p-4">
          <CardTitle className="flex items-center gap-3">
            <div className="rounded-full flex p-3 bg-[#475263] mb-auto">
              <User color="#fff" />
            </div>
            <CardDescription className="flex flex-col gap-2">
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-start text-[#334155] text-xl justify-start">
                  {entity?.name}
                </div>
                {getEntityOwners && getEntityOwners.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[#475569] font-medium text-sm">
                      {getEntityOwners.length === 1
                        ? "Department Owner"
                        : "Department Owners"}
                    </span>
                    <div className="flex flex-col gap-1 text-sm text-[#64748B]">
                      {getEntityOwners.map((owner: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">
                            {owner}
                          </span>
                          <Copy
                            size={16}
                            strokeWidth={2}
                            className="cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(owner);
                              toast({
                                title: "Copied to clipboard!",
                                variant: "success",
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardDescription>
          </CardTitle>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center justify-between p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Overall tokens allocated
              </span>
              <Coins />
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {totalAllocatedTokens ?? "0"}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center justify-between p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Available tokens
              </span>
              <Coins />
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {unallocatedTokens ?? "0"}
          </CardFooter>
        </Card>
      </div>

      <TokenAllocateForm id={entity?.rewardManagement} />
    </main>
  );
};

export default TokenCreateMain;
