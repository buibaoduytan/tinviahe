
export interface Cat {
  id: string;
  name: string;
  image: string;
  meme: string;
  value: string;
  stats?: Record<string, number>;
};

export interface Room {
  activityId: string;
  x: number; // % theo bản đồ
  y: number;
  w: number;
  h: number;
};

export interface Planet {
  id: string;
  name: string;
  subtitle: string;
  thumb: string;
  mapBg: string;
  borderColor: string;
  cats: Cat[];
  total_price : string;

};

export interface Selected {
  cat: Cat;
  room: Room;
};
