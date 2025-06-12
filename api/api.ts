import axios from 'axios';

export interface ApiEvent {
  eventId:   string;
  name:      string;
  startTime: string;   // ISO timestamp
  location:  string;
  points:    number;
}

interface CardType {
  id: string;
  title: string;
  time: string;
  location: string;
  pts: number;
  description?: string; // optional for modal
}


export async function fetchAllEvents(): Promise<CardType[]> {
  const resp = await axios.get<ApiEvent[]>(
    'https://api.reflectionsprojections.org/events'
  );
  return resp.data.map((e) => ({
    id:       e.eventId,
    title:    e.name,
    time:     new Date(e.startTime).toLocaleTimeString('en-US', {
                hour:   'numeric',
                minute: '2-digit',
              }),
    location: e.location,
    pts:      e.points,
  }));
}
