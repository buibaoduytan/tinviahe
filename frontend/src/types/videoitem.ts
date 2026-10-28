export interface VideoItem {
  id: string | number;
  resolvedVideoUrl: string;
  resolvedThumb: string;
  resolvedTitle: string;
  resolvedDescription: string;
  resolvedAuthor: string;
  resolvedTag: string;
  resolvedSource: string;
  resolvedDate: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  likedByUser: boolean;
  savedByUser: boolean;
};