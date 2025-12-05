import axios from "axios";

const URL = process.env.NEXT_PUBLIC_PARTICIPANT_LOOKUP_URL;
const ParticipantLookupApiKey = process.env.NEXT_PUBLIC_PARTICIPANT_LOOKUP_API_KEY;

export const participantLookupClient = axios.create({
  baseURL: URL,
  headers: {
    "rs-api-key": ParticipantLookupApiKey,
  },
});

