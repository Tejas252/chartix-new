import { charts, chartVersions, chartShareLinks } from "@/utils/db/schema/charts";

export type Chart = typeof charts._.inferSelect;
export type NewChart = typeof charts._.inferInsert;
export type ChartVersion = typeof chartVersions._.inferSelect;
export type NewChartVersion = typeof chartVersions._.inferInsert;
export type ChartShareLink = typeof chartShareLinks._.inferSelect;
export type NewChartShareLink = typeof chartShareLinks._.inferInsert;