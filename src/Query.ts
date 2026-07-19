/* eslint-disable @typescript-eslint/no-unused-expressions */
import { dateTable } from "./layers";
import { cp_f } from "./uniqueValues";
import QueryExpressionLayers from "query-layers-expression";

//---------------------------------//
// Reset Layers for Time slider    //
//---------------------------------//
interface TimeSliderResetType {
  layers: any[];
  field_name: string;
  new_date: any;
  contractcp?: string;
}
export function layersTimeSliderReset({
  layers,
  field_name,
  new_date,
  contractcp,
}: TimeSliderResetType) {
  layers.forEach((layer: any) => {
    if (!contractcp) {
      layer.definitionExpression = `${field_name} <= date '${new_date}'`;
    } else {
      layer.definitionExpression = `${field_name} <= date '${new_date}' AND ${cp_f} = '${contractcp}'`;
    }
  });
}

//---------------------------------------------------------//
//                 Add Layers to Map                      //
//---------------------------------------------------------//
export function addLayersToMap(map: any, layersList: any[]) {
  layersList.forEach((layer: any) => {
    map.add(layer);
  });
}

//--- Returns query expression
export const makeQuery = (
  qValues: string[],
  qFields: string[],
  qExpression?: string,
  q2Expression?: string,
) => {
  const q = new QueryExpressionLayers();
  q.qValues = qValues;
  q.qFields = qFields;
  if (qExpression) q.qExpression = qExpression;
  if (q2Expression) q.q2Expression = q2Expression;
  return q;
};

//---------------------------------------------//
//     Viaduct Stacked Column chart            //
//---------------------------------------------//

//--- Chart Data Generation helper function
// `pieChartData` function helps to assign parameter names to class `ChartPieSeries`
interface StackColumnChartDataType {
  colchart: any;
  qChart: any;
  categoryTypes: any;
  categoryTypeField: any;
  layers: any;
  statusField: any;
  statusState: any;
}

export async function stackColumnChartData({
  colchart,
  qChart,
  categoryTypes,
  categoryTypeField,
  layers,
  statusField,
  statusState,
}: StackColumnChartDataType) {
  Object.assign(colchart, {
    qChart: qChart.queryExpression(),
    categoryTypes,
    categoryTypeField,
    layers,
    statusField,
    statusState,
  });
  return await colchart.chartDataStackColumns();
}

type StatusTypeNamesType =
  | "To be Constructed"
  | "Under Construction"
  | "delayed"
  | "Completed"
  | "Exceeded"
  | "Normal";

type StatusStateType =
  | "comp"
  | "incomp"
  | "ongoing"
  | "delayed"
  | "exceeded"
  | "normal";

interface ChartStackColumnRender {
  render: any;
  revit: boolean;
  layers: any;
  root: any;
  chart: any;
  data: any;
  buildingLayer?: any;
  qChart: any;
  chartCategoryTypes: any;
  chartCategoryTypeField: any;
  statusTypename: StatusTypeNamesType[];
  statusStatename: StatusStateType[];
  statusArray: any;
  statusField: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  view: any;
  setLayerViewFilter?: any;
  new_chartIconSize: any;
  new_axisFontSize: any;
  chartIconPositionX?: any;
  chartPaddingRightIconLabel: any;
  legend: any;
  updateChartPanelwidth: any;
}

export async function stackColumnChartRender({
  render,
  ...props
}: ChartStackColumnRender) {
  Object.assign(render, props);
  return await render.chartRendererColumn();
}

//--------------------------------------//
//         Reset layer visibility       //
//--------------------------------------//
interface layersRevitVisibilityType {
  layers: any;
}

export const resetAllLayers = ({ layers }: layersRevitVisibilityType) => {
  try {
    if (layers) {
      layers.map((layer: any) => {
        if (layer) {
          layer.layer.definitionExpression = "1=1";
          layer.layer.visible = true;
        }
      });
    }
  } catch (error: any) {
    console.error("error");
  }
};

//---------------------------------------------------------//
//                Date Function                           //
//---------------------------------------------------------//
export function yearMonthDay(date: Date) {
  return {
    year: date?.getFullYear() ?? 0,
    month: date?.getMonth() + 1,
    day: date?.getDate(),
  };
}

export function toAsofdate(date: Date) {
  //--- Return displayed date: (as of date)
  const { year, day } = yearMonthDay(date);
  const cmonth = date?.toLocaleString("en-US", { month: "long" });

  return year <= 1970 ? "" : `${cmonth} ${day}, ${year}`;
}

export async function dateUpdate(category: string) {
  //--- Only executed during an initial render
  const query = dateTable.createQuery();
  query.where = `project = 'SC' AND category = '${category}'`;

  const { features } = await dateTable.queryFeatures(query);
  return features.map(({ attributes }: any) => {
    const date = new Date(attributes.date);
    const asofdate = toAsofdate(date);

    return asofdate;
  });
}

//---------------------------------//
//           Media query           //
//---------------------------------//
export async function mediaQuery(layer: any, ID: any) {
  const query = layer.createQuery();
  query.where = `id = ${ID}`;

  const result = await layer.queryFeatures(query);
  const data = result.features.map((item: any) => {
    return Object.assign({
      timestamp: Number(item.attributes["TimeStamp"]),
      path: item.attributes["Path"],
    });
  });
  data.sort((a: any, b: any) => a.timestamp - b.timestamp);

  return data;
}

interface updateMediaInfoType {
  mediaLayer: any;
  id: any;
  srcpath: any;
  timestamp: any;
}
export async function updateMediaInfo({
  mediaLayer,
  id,
  srcpath,
  timestamp,
}: updateMediaInfoType) {
  const item = await mediaQuery(mediaLayer, id);

  if (item.length === 1) {
    srcpath([item[0].path, ""]);
    timestamp([item[0].timestamp, ""]);
  } else {
    srcpath([item[0].path, item[1].path]);
    timestamp([item[0].timestamp, item[1].timestamp]);
  }
}

export async function mediaTimestampToDates(timestamp: any) {
  const parseTimestamp = (ts: number | string) => {
    const str = ts.toString();
    const year = Number(str.slice(0, 4));
    const month = Number(str.slice(4, 6)) - 1; // JS months are 0-indexed
    return new Date(year, month, 1);
  };

  const date1 = parseTimestamp(timestamp[0]);
  const date2 = parseTimestamp(timestamp[1]);

  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  return {
    yyyy1: date1.getFullYear().toString(),
    yyyy2: date2.getFullYear().toString(),
    mm1: monthFormatter.format(date1),
    mm2: monthFormatter.format(date2),
  };
}

//---------------------------------//
//           Others           //
//---------------------------------//
// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

//---------------------------------//
//           Layer List            //
//---------------------------------//
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }
  item.title === "Chainage" ||
  item.title === "Viaduct" ||
  item.title === "S04 Viaduct (LOD: 350)" ||
  item.title === "Exterior Shell" ||
  item.title === "Bearings" ||
  item.title === "Specialty Equipment (Not Monitored)" ||
  item.title === "Bearings (Not Monitored)" ||
  item.title === "Abutments (Not Monitored)"
    ? (item.visible = false)
    : (item.visible = true);
}
