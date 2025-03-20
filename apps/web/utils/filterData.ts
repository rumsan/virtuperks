export const filterUnacceptedParticipants = (
  participantDatas: any[],
  acceptedParticipant: any[]
) => {
  if (!participantDatas || !acceptedParticipant) return [];

  return participantDatas.filter((participant) => {
    // Check if participant is not in accepted list
    const isAccepted = acceptedParticipant.some(
      (accepted) => accepted.participant === participant.participant
    );
    
    // Return only unaccepted participants
    return !isAccepted && participant.status === "UNACCEPTED";
  });
};
