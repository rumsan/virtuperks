import axios from "axios";

const URL = process.env.NEXT_Participant_LOOKUP_URL;
const ParticipantLookupApiKey = process.env.ParticipantLookupApiKey;

// Create reusable axios instance
export const participantLookupClient = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": ParticipantLookupApiKey,
  },
});
