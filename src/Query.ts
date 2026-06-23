/* eslint-disable @typescript-eslint/no-unused-expressions */
import { dateTable } from "./layers";
import { cp_field, months } from "./uniqueValues";
// import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
// import Query from "@arcgis/core/rest/support/Query";

// Updat date
export async function dateUpdate() {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  query.where = "project = 'SC'" + " AND " + "category = 'Viaduct'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

//--- Timeseries chart data
// export async function timeSeriesChartData(
//   layer: any,
//   types: any,
//   qChart: any,
//   type_field: any,
//   time_field: any, //finish_actual
// ) {
//   const compile: any = [];
//   types.map((type: any) => {
//     const temp = new StatisticDefinition({
//       onStatisticField: `CASE WHEN (${type_field} = ${type} and Status = 4) THEN 1 ELSE 0 END`,
//       outStatisticFieldName: `stats${type}`,
//       statisticType: "sum",
//     });
//     compile.push(temp);
//   });

//   //--- Query
//   const query = new Query();
//   query.outStatistics = compile;
//   query.where = `${qChart} AND ${time_field} IS NOT NULL`;
//   query.outFields = [time_field];
//   query.orderByFields = [time_field];
//   query.groupByFieldsForStatistics = [time_field];

//   //--- Query features using statistics definitions
//   const response = await layer?.queryFeatures(query);

//   const data = response.features.map((result: any) => {
//     const attributes = result.attributes;
//     const date = attributes[time_field];

//     const pile = attributes[compile[0].outStatisticFieldName];
//     const pilecap = attributes[compile[1].outStatisticFieldName];
//     const pier = attributes[compile[2].outStatisticFieldName];
//     const pierhead = attributes[compile[3].outStatisticFieldName];
//     const precast = attributes[compile[4].outStatisticFieldName];
//     const atgrade = attributes[compile[5].outStatisticFieldName];

//     return Object.assign({
//       date,
//       pile: pile,
//       pilecap: pilecap,
//       pier: pier,
//       piearhead: pierhead,
//       precast: precast,
//       atgrade: atgrade,
//     });
//   });

//   return data;
// }

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
  const yyyy1 = timestamp[0].toString().slice(0, 4);
  const yyyy2 = timestamp[1].toString().slice(0, 4);
  const mm1 = months[Number(timestamp[0].toString().slice(4, 6)) - 1];
  const mm2 = months[Number(timestamp[1].toString().slice(4, 6)) - 1];

  return { yyyy1, yyyy2, mm1, mm2 };
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

// Layer list
// For non-monitored components, make it invisible when opened.
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
  item.title === "Structural Framing (Not Monitored)" ||
  item.title === "Bearings (Not Monitored)" ||
  item.title === "Abutments (Not Monitored)"
    ? (item.visible = false)
    : (item.visible = true);
}

// Timeslider reset
interface TimeSliderResetType {
  layer: any;
  field_name: string;
  new_date: any;
  contractcp?: string;
}
export function layersTimeSliderReset({
  layer,
  field_name,
  new_date,
  contractcp,
}: TimeSliderResetType) {
  if (!contractcp) {
    layer.definitionExpression = `${field_name} <= date '${new_date}'`;
  } else {
    layer.definitionExpression = `${field_name} <= date '${new_date}' AND ${cp_field} = '${contractcp}'`;
  }
}
