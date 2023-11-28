export type PartType = {
  id: number;
  isDone: boolean;
  title: string;
}

export type EpisodeType = {
  id: number;
  title: string;
  parts: PartType[]
}
