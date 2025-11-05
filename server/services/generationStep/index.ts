import { formatDate, formatDayOfWeek, formatMonth, formatMonthName, formatQuarter, formatToDate, formatToMonth, formatWeek, formatYear } from "@/lib/utils/date-utils";
import * as aq from "arquero";

type Step =
  | { type: "filter"; condition: string }
  | { type: "derive"; name: string; expression: string }
  | { type: "groupBy"; groupByColumns: string[]; numericalColumnsToAggregate: Record<string, string> }
  | { type: "sort"; sortColumns: { column: string; order: "asc" | "desc" }[] }
  | { type: "pivot"; keyColumn: string; valueColumn: string; aggregator: string; groupby?: string[] }
  | { type: "fold"; columns: string[]; key: string; value: string }
  | { type: "unroll"; column: string };

type UniversalChartFormat = {
  columns: { id: string; type: "dimension" | "measure"; optional?: boolean; datatype?: "string" | "number" | "date" }[];
  rows: { x: string | number | Date; y: number | null; series?: string }[];
};


// Example helper function
// const formatMonth = (date: string | Date) => {
//   const d = new Date(date);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// const formatDate = (date: string | Date) => {
//   const d = new Date(date);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// }

function rowsToColumns(rows: Record<string, any>[]): Record<string, any[]> {
  const columns: Record<string, any[]> = {};

  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      if (!columns[key]) {
        columns[key] = [];
      }
      columns[key].push(value);
    }
  }

  return columns;
}

// Register in Arquero
aq.addFunction("formatMonth", formatMonth);
aq.addFunction("formatDate", formatDate);
aq.addFunction("formatYear", formatYear);
aq.addFunction("formatQuarter", formatQuarter);
aq.addFunction("formatDayOfWeek", formatDayOfWeek);
aq.addFunction("formatMonthName", formatMonthName);
aq.addFunction("formatWeek", formatWeek);

export function executeSteps(data: object, steps: Step[]): any[] {
  let t = aq.table(data);


  for (const step of steps) {
    switch (step.type) {
      case "filter":
        let fnCondition = step.condition;

        // If expression is an arrow function, strip the "d =>"
        if (fnCondition.includes("=>")) {
          fnCondition = fnCondition.split("=>")[1].trim();
        }
        t = t.filter(new Function("d", `return ${fnCondition}`) as any);
        break;

      case "derive":
        let fnBody = step.expression;

        // If expression is an arrow function, strip the "d =>"
        if (fnBody.includes("=>")) {
          fnBody = fnBody.split("=>")[1].trim();
        }

        // Build function from body
        const fn = new Function("d", `return ${fnBody}`) as any;

        t = t.derive({ [step.name]: fn });
        break;

      case "groupBy":
        let aggSpec: Record<string, any> = {};
        if (step.numericalColumnsToAggregate) {
          for (const [col, agg] of Object.entries(step.numericalColumnsToAggregate)) {
            aggSpec[col] = aq.op[agg](col); // ✅ no closures, just op.sum("col")
          }
        }

        if (Object.keys(aggSpec).length > 0) {
          console.log(...step.groupByColumns,aggSpec,t.columnNames())
          t = t.groupby(...step.groupByColumns).rollup(aggSpec);
        } else {
          t = t.groupby(...step.groupByColumns);
        }
        break;
      case "sort":
        // TODO: fix this
        const sortExprs = step.sortColumns.map((sc) =>
          sc.order === "asc" ? aq.desc(sc.column) : aq.desc(sc.column)
        );
        t = t.orderby(...sortExprs);
        break;

      case "pivot": {
        if(step.groupby?.length){

          // Materialize table
          const rows = t.objects();
  
          // Group rows by groupby keys
          const grouped = new Map<string, any>();
  
          for (const row of rows) {
            // 🔑 Build composite key (like "Jan||Furniture")
            const groupKey = step.groupby.map(g => row[g]).join("||");
  
            if (!grouped.has(groupKey)) {
              grouped.set(
                groupKey,
                Object.fromEntries(step.groupby.map(g => [g, row[g]])) // init with group keys
              );
            }
  
            const outRow = grouped.get(groupKey);
  
            // assign pivoted column
            outRow[row[step.keyColumn]] = row[step.valueColumn];
          }
  
          // ✅ Convert grouped map → row array
          const pivoted = Array.from(grouped.values());
  
          // ✅ Convert row array → column dictionary
          const pivotedColumns = rowsToColumns(pivoted);
  
          // ✅ Reinitialize table
          t = aq.table(pivotedColumns);
        }else{
          t = t.pivot(step.keyColumn, step.aggregator ? {value: d => (aq.op as any)[step.aggregator](d[step.valueColumn])} :step.valueColumn);
        }
        break;
      }



      case "fold":
        t = t.fold(step.columns, { as: [step.key, step.value] });
        break;

      case "unroll":
        t = t.unroll(step.column);
        break;
    }
    console.log(t.columnNames())
  }

  console.log(t.objects())

  return t.objects();
}



export function normalizeForChart(data: any[]): UniversalChartFormat {
  if (!data.length) {
    return {
      columns: [
        { id: "x", type: "dimension", datatype: "string" },
        { id: "y", type: "measure", datatype: "number" },
        { id: "series", type: "dimension", optional: true, datatype: "string" }
      ],
      rows: []
    };
  }

  const cols = Object.keys(data[0]);
  const xField = cols[0]; // heuristic: first col = x
  const numericFields = cols.slice(1).filter((c) => typeof data[0][c] === "number");

  const rows: UniversalChartFormat["rows"] = [];

  for (const row of data) {
    for (const field of numericFields) {
      const yValue = row[field];
      rows.push({
        x: String(row[xField]),
        y: yValue === null || yValue === undefined ? null : Number(yValue),
        ...(numericFields.length > 1 ? { series: field } : {})
      });
    }
  }

  return {
    columns: [
      { id: "x", type: "dimension", datatype: "string" },
      { id: "y", type: "measure", datatype: "number" },
      { id: "series", type: "dimension", optional: true, datatype: "string" }
    ],
    rows
  };
}

function toUniversalFormat(
  columns: { id: string; type: "dimension" | "measure"; optional?: boolean; datatype?: "string" | "number" | "date" }[],
  data: Record<string, any>[]
): UniversalChartFormat {
  // identify column roles
  const xCol = columns.find(c => c.type === "dimension")?.id;
  const yCol = columns.find(c => c.type === "measure")?.id;
  const seriesCol = columns.filter(c => c.type === "dimension")[1]?.id; // second dimension if exists

  if (!xCol || !yCol) {
    throw new Error("At least one dimension (x) and one measure (y) are required.");
  }

  const rows = data.map(row => {
    const yValue = row[yCol];
    const formatted: { x: string | number | Date; y: number | null; series?: string } = {
      x: row[xCol],
      y: yValue === null || yValue === undefined ? null : Number(yValue),
    };
    if (seriesCol) {
      formatted.series = String(row[seriesCol]);
    }
    return formatted;
  });

  return { columns, rows };
}

type UniversalRow = { x: string | number | Date; y: number | null; series?: string };

function toUniversalFormatFromPivot(
  columns: { id: string; type: "dimension" | "measure"; optional?: boolean; datatype?: "string" | "number" | "date" }[],
  data: Record<string, any>[]
): UniversalChartFormat {
  if (!data || data.length === 0) return { columns, rows: [] };

  // All dimension ids declared
  const declaredDims = columns.filter(c => c.type === "dimension").map(c => c.id);

  // Pick xCol as the **first declared dimension that actually exists in data**
  const dataKeys = new Set(Object.keys(data[0]));
  let xCol = declaredDims.find(id => dataKeys.has(id));
  // Fallback: if no declared dimension exists in data, try "Month" or any key present
  // if (!xCol) xCol = ["Month", ...Object.keys(data[0])].find(k => dataKeys.has(k));
  if (!xCol) throw new Error("No usable dimension (x) found in data.");

  // Declared measures present in data
  const declaredMeasures = columns
    .filter(c => c.type === "measure")
    .map(c => c.id);
  const declaredMeasuresPresent = declaredMeasures.filter(id =>
    data.some(r => r[id] !== undefined && r[id] !== null)
  );

  // If declared measures not found (typical after pivot), auto-detect measures
  let measureCols: string[] = [];
  let pivotDetected = false;

  if (declaredMeasuresPresent.length > 0) {
    measureCols = declaredMeasuresPresent;
  } else {
    // Auto-detect: any key that is not a declared dimension and has numeric values in the data
    const dimSet = new Set(declaredDims);
    const candidateKeys = Object.keys(data[0]).filter(k => !dimSet.has(k));

    const isNumericLike = (v: any) =>
      v !== null && v !== undefined && v !== "" && !Number.isNaN(Number(v));

    // Keep keys that have at least one numeric value across the dataset
    measureCols = candidateKeys.filter(k => data.some(r => isNumericLike(r[k])));
    pivotDetected = measureCols.length > 1; // multiple measures => likely pivoted wide table
  }

  if (measureCols.length === 0) {
    throw new Error("No measure columns found in data after pivot/aggregation.");
  }

  const rows: UniversalRow[] = [];

  for (const row of data) {
    const xVal = row[xCol];
    // Emit one row per measure column (skip null/undefined)
    for (const m of measureCols) {
      const v = row[m];
      if (v === undefined || v === null || v === "") continue;
      const num = Number(v);
      if (Number.isNaN(num)) continue;
      rows.push({ x: xVal, y: num, series: m });
    }
  }

  // If we detected pivot (multiple measure columns), ensure columns includes a series dimension
  let outColumns: { id: string; type: "dimension" | "measure"; optional?: boolean | undefined; datatype?: string | "number" | "date" }[] = columns?.filter(c => c.type === "dimension" && c.id === xCol) || [];
  if (pivotDetected && !columns.some(c => c.id === "series" && c.type === "dimension")) {
    outColumns = [
      ...columns,
      ...(measureCols.map(m => ({ id: m, type: "measure", datatype: "number" }))),
    ];
  }

  return { columns: outColumns, rows };
}




/**
 * Normalizes an arbitrary Arquero output into universal ApexCharts format
 */
// export function normalizeForChart(data: any[]): UniversalChartFormat {
//   if (!data.length) return { categories: [], series: [] };

//   const cols = Object.keys(data[0]);
//   const xField = cols[0]; // heuristic: first column → category
//   const yFields = cols.slice(1); // remaining numeric fields → series

//   const categories = data.map((d) => String(d[xField]));

//   const series = yFields.map((field) => ({
//     name: field,
//     data: data.map((d) => Number(d[field] ?? 0)),
//   }));

//   return { categories, series };
// }

/**
 * Full pipeline: Steps → Arquero → Universal Format
 */
export function processDataToChartFormat(
  rawData: { [key: string]: any[] },
  steps: Step[],
  columns: { id: string; type: "dimension" | "measure"; optional?: boolean }[]
): { transformed: any[], normalized: UniversalChartFormat } {
  const transformed = executeSteps(rawData, steps);
  const isPivoteInclude = steps.some(step => step.type === "pivot");
  if(isPivoteInclude){
    return { transformed, normalized: toUniversalFormatFromPivot(columns, transformed) }
  }
  return { transformed, normalized: toUniversalFormat(columns, transformed) }
}
