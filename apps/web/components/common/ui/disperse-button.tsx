import { Button } from "@workspace/ui/components/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface DisperseButtonProps {
  isDispersed: boolean;
  isDisabled: boolean;
  hasVerifiedParticipants: boolean;
  hasEntityOwnerRole: boolean;
  onClick: () => void;
  isDisbursed?: boolean; // Local state to show immediate feedback
  isLoading?: boolean;
}

export const DisperseButton = ({
  isDispersed,
  isDisabled,
  hasVerifiedParticipants,
  hasEntityOwnerRole,
  onClick,
  isDisbursed = false,
  isLoading = false,
}: DisperseButtonProps) => {
  // If tokens are already disbursed (from contract or local state), show "Dispersed Token" state
  if (isDispersed || isDisbursed) {
    return (
      <div className="relative group flex items-center">
        <Button
          variant="outline"
          disabled
          className="border border-[#03AB65] bg-green-50 cursor-not-allowed"
        >
          <span className="text-[#03AB65]">Disbursed Token</span>
          <CheckCircle
            className="ml-2"
            style={{
              color: "#03AB65",
              strokeWidth: 2.5,
              width: 20,
              height: 20,
            }}
          />
        </Button>
      </div>
    );
  }

  // Show tooltip conditions
  const showTooltip = !hasVerifiedParticipants || !hasEntityOwnerRole;

  return (
    <div className="relative group flex items-center">
      <Button
        variant="outline"
        disabled={isDisabled || isLoading}
        className="border border-[#03AB65] disabled:cursor-not-allowed disabled:hover:bg-transparent"
        onClick={onClick}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-[#03AB65]">Disbursing...</span>
          </>
        ) : (
          <>
            <span className="text-[#03AB65]">Disburse Token</span>
            <CheckCircle
              className="ml-2"
              style={{
                color: "#03AB65",
                strokeWidth: 2.5,
                width: 20,
                height: 20,
              }}
            />
          </>
        )}
      </Button>

      {/* Tooltip - only show when not loading */}
      {showTooltip && !isLoading && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-start gap-1 bg-yellow-100 border border-yellow-300 text-yellow-700 text-sm rounded-md px-3 py-2 shadow w-max max-w-xs z-10">
          <div className="flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <div className="flex flex-col gap-1">
              {!hasEntityOwnerRole && (
                <span>Only entity owners can disburse tokens</span>
              )}
              {!hasVerifiedParticipants && (
                <span>Verified task can only be disburse</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
