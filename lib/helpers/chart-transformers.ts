import { UniversalChartFormat, ChartType, ChartAnnotation } from "@/types/chart";
import dayjs from "dayjs";
import { ca } from "zod/v4/locales";

export function transformToApex(
  data: UniversalChartFormat,
  type: ChartType,
  annotations: ChartAnnotation[] = []
) {
  let { rows } = data;

  rows = rows.filter((row)=> !['null','undefined','NaN',undefined,null,'']?.includes(row?.y))


  let series: any[] = [];
  let options: any = {
    chart: { type, toolbar: { show: true } },
    xaxis: {},
    annotations: { points: [], yaxis: [], xaxis: [] },
  };
  let chartType = null

  switch (type) {
    case "bar":
    case "line":
      // Group by series if present
      if (rows.some(r => r.series)) {
        const grouped: Record<string, { x: any; y: number }[]> = {};
        rows.forEach(r => {
          if (!grouped[r.series!]) grouped[r.series!] = [];
          grouped[r.series!].push({ x: r.x, y: r.y });
        });
        series = Object.entries(grouped).map(([name, data]) => ({
          name,
          data,
        }));
      } else {
        series = [{ name: "Value", data: rows.map(r => ({ x: r.x, y: r.y })) }];
      }
      break;

    case "combo":
      // Example: first series = bar, second = line
      series = [
        {
          name: "Bar",
          type: "column",
          data: rows.map(r => ({ x: r.x, y: r.y })),
        },
        {
          name: "Line",
          type: "line",
          data: rows.map(r => ({ x: r.x, y: r.y })),
        },
      ];
      options.chart = { type: "line", stacked: false };
      chartType = 'line'
      break;

    case "pie":
      series = rows.map(r => r.y);
      options.labels = rows.map(r => String(r.x));
      break;

    case "scatter":
      series = [
        {
          name: "Scatter",
          data: rows.map((r, i) => {
            let xValue: number;
            if (typeof r.x === "number") xValue = r.x;
            else if (r.x instanceof Date) xValue = r.x.getTime();
            else xValue = i; // fallback for strings

            return {
              x: xValue,
              y: r.y,
              label: String(r.x), // keep original for tooltip
              series: r.series,
            };
          }),
        },
      ];
      options.chart = { type: "scatter" };
      options.xaxis = { tickAmount: 10 };
      options.tooltip = {
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          const point = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          return `
              <div class="px-2 py-1">
                <b>${point.label}</b><br/>
                Value: ${point.y}
                ${point.series ? `<br/>Series: ${point.series}` : ""}
              </div>
            `;
        },
      };
      break;

    case "heatmap":
      series = [
        {
          name: "Heatmap",
          data: rows.map(r => ({ x: String(r.x), y: r.y })),
        },
      ];
      options.plotOptions = {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: { ranges: [] },
        },
      };
      break;

    case "funnel":
      series = [
        {
          name: "Funnel Series",
          data: rows.map(r => r.y),
        },
      ];

      options.chart = {
        type: "bar",
        height: 350,
      };
      options.plotOptions = {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: '80%',
          isFunnel: true,
        },
      }
      options.xaxis = {
        categories: rows.map(r => String(r.x))
      }
      options.dataLabels = { enabled: true };
      chartType = 'bar'
      break;

    case "candlestick":
      let running = 0;
      const wfData = rows.map(r => {
        const start = running;
        running += r.y;
        return { x: r.x, y: [start, start, running, running] };
      });

      series = [{ name: "Waterfall", data: wfData }];
      options.chart = { type: "candlestick" };
      options.stroke = {
        curve: "monotoneCubic",
      }
      options.markers = {
        hover: {
          sizeOffset: 5
        }
      }
      options.dataLabels = {
        enabled: false
      }
      // options.plotOptions = {
      //   bar: { horizontal: false },
      // };
      break;
  }

  // Apply Annotations
  annotations.forEach(a => {
    if (a.x !== undefined) {
      options.annotations!.points.push({
        x: a.x,
        marker: { size: 6, fillColor: a.color || "red" },
        label: { text: a.label, style: { background: a.color || "red" } },
      });
    }
    if (a.y !== undefined) {
      options.annotations!.yaxis.push({
        y: a.y,
        borderColor: a.color || "blue",
        label: { text: a.label, style: { background: a.color || "blue" } },
      });
    }
  });

  return { series, options, chartType };
}
