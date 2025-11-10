import { Button } from "@workspace/ui/components/button";
import { CheckCircle } from "lucide-react";

interface DisperseButtonProps {
  isDispersed: boolean;
  isDisabled: boolean;
  hasVerifiedParticipants: boolean;
  hasEntityOwnerRole: boolean;
  onClick: () => void;
}

export const DisperseButton = ({
  isDispersed,
  isDisabled,
  hasVerifiedParticipants,
  hasEntityOwnerRole,
  onClick,
}: DisperseButtonProps) => {
  // If tokens are already disbursed, show "Dispersed Token" state
  if (isDispersed) {
    return (
      <div className="relative group flex items-center">
        <Button
          variant="outline"
          disabled
          className="border border-[#03AB65] bg-green-50 cursor-not-allowed"
        >
          <span className="text-[#03AB65]">Dispersed Token</span>
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
        disabled={isDisabled}
        className="border border-[#03AB65] disabled:cursor-not-allowed disabled:hover:bg-transparent"
        onClick={onClick}
      >
        <span className="text-[#03AB65]">Disperse Token</span>
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

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-start gap-1 bg-yellow-100 border border-yellow-300 text-yellow-700 text-sm rounded-md px-3 py-2 shadow w-max max-w-xs z-10">
          <div className="flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <div className="flex flex-col gap-1">
              {!hasEntityOwnerRole && (
                <span>Only entity owners can disperse tokens</span>
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
