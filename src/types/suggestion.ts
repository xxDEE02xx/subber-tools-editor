export type SuggestionType = {
  id: number;
  segmentId: number;
  subtitleId: number;
  type: string;
  oldContent: string;
  newContent: string;
  diffContent: string;
  isImplemented?: boolean;
}
