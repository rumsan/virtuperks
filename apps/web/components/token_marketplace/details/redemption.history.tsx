type RedemptionStatus = "completed" | "pending";

interface Redemption {
  name: string;
  date: string;
  status: RedemptionStatus;
  txnId: string;
}

interface RedemptionHistoryProps {
  redemptions: Redemption[];
}

const RedemptionHistory = ({ redemptions }: RedemptionHistoryProps) => {
  return (
    <div className="border border-gray-200 shadow-sm rounded-xl p-6 bg-white">
      <h3 className="text-lg font-bold mb-4">Redemption History</h3>
      <p className="text-sm text-gray-500 mb-4">
        Recent redemptions for this token
      </p>
      <div className="space-y-3">
        {redemptions.map((r, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  r.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {r.status}
              </span>
              <div>
                <p className="font-semibold text-gray-800">{r.name}</p>
                <p className="text-xs text-gray-500">{r.date}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 text-right">
              <p className="text-gray-400">Transaction ID</p>
              <strong>{r.txnId}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedemptionHistory;
