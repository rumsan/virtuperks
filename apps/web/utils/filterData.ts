export const filterParticipants = (
  participantDatas: any[],
  acceptedParticipant: any[],
  completedData: any[]
) => {
  if (!participantDatas) return [];

  // Get unaccepted participants that aren't in accepted list
  const unacceptedParticipants = participantDatas.filter(participant => {
    const isAccepted = acceptedParticipant?.some(
      accepted => accepted.participant === participant.participant
    );
    return !isAccepted && participant.status === "UNACCEPTED";
  });

  // Format completed participants
  const formattedCompletedData = completedData?.map(completed => ({
    ...completed,
    
  })) || [];

  // Combine both arrays
  return [...unacceptedParticipants, ...formattedCompletedData];
};
