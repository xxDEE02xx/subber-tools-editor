import { SubtitleType } from '@/types/subtitle'
import { SuggestionType } from '@/types/suggestion'

export type SegmentType = {
  id: number;
  userId: string;
  videoId: string;
  startTime: number;
  endTime: number;
  subtitle: SubtitleType,
  suggestions?: SuggestionType[],
}
