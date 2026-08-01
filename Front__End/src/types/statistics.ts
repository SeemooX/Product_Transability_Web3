export interface Statistics {
  [key: string]: string | number;
}

export interface DashboardStat {
  value: string | number;
  label: string;
  color: string;
  icon: string;
}