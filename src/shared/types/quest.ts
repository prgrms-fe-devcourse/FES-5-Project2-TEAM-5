export interface Quest {
  accepted_at: string;
  diary_analysis_id: string;
  is_completed: boolean;
  quest_id: number;
  user_id: string;
  quests: {
    title: string;
    content: string;
  };
}
