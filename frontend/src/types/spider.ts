export interface SpiderDataPoint {
  subject: string;
  [seriesKey: string]: string | number;
}

export interface SpiderSeries {
  key: string; // tên field trong SpiderDataPoint, vd: "teamA"
  name: string; // tên hiển thị trong legend, vd: "Đội A"
  color: string; // màu viền + fill, vd: "#6366f1"
}

export interface SpiderChartProps {
  data: SpiderDataPoint[];
  series: SpiderSeries[];
  maxValue?: number; // giá trị tối đa của trục radius, mặc định 100
  title?: string;
}