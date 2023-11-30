export type PartType = {
  id: number;
  completed: boolean;
  title: string;
  startTime: number;
  endTime: number;
  number: number;
}

export type EpisodeType = {
  id: number;
  title: string;
  parts: PartType[]
}
