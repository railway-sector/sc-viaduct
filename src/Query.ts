/* eslint-disable @typescript-eslint/no-unused-expressions */
import { dateTable, viaductLayerStatus4 } from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import { cp_field } from "./uniqueValues";

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
export async function timeSeriesChartData(contractp: any) {
  const total_complete_pile = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pile",
    statisticType: "sum",
  });

  const total_complete_pilecap = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 2 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pilecap",
    statisticType: "sum",
  });

  const total_complete_pier = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pier",
    statisticType: "sum",
  });

  const total_complete_pierhead = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 4 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pierhead",
    statisticType: "sum",
  });

  const total_complete_precast = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 5 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_precast",
    statisticType: "sum",
  });

  const total_complete_atgrade = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 7 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_atgrade",
    statisticType: "sum",
  });

  const query = viaductLayerStatus4.createQuery();
  // eslint-disable-next-line no-useless-concat

  if (!contractp) {
    // eslint-disable-next-line no-useless-concat
    query.where = "finish_actual IS NOT NULL" + " AND " + "CP = 'S-01'";
  } else {
    // eslint-disable-next-line no-useless-concat
    query.where =
      "finish_actual IS NOT NULL" + " AND " + "CP = '" + contractp + "'";
  }

  query.outStatistics = [
    total_complete_pile,
    total_complete_pilecap,
    total_complete_pier,
    total_complete_pierhead,
    total_complete_precast,
    total_complete_atgrade,
  ];
  query.outFields = ["finish_actual", "CP"];
  query.orderByFields = ["finish_actual"];
  query.groupByFieldsForStatistics = ["finish_actual"];

  return viaductLayerStatus4.queryFeatures(query).then((response: any) => {
    const stats = response.features;

    // collect all dates for each viaduct type
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const date = attributes.finish_actual;

      const pileCount = attributes.total_complete_pile;
      const pilecapCount = attributes.total_complete_pilecap;
      const pierCount = attributes.total_complete_pier;
      const pierheadCount = attributes.total_complete_pierhead;
      const precastCount = attributes.total_complete_precast;
      const atgradeCount = attributes.total_complete_atgrade;

      // compile in object
      return Object.assign(
        {},
        {
          date,
          pile: pileCount,
          pilecap: pilecapCount,
          pier: pierCount,
          piearhead: pierheadCount,
          precast: precastCount,
          atgrade: atgradeCount,
        },
      );
    });
    return data;
  });
}

//---------------------------------//
//           Media query           //
//---------------------------------//
export async function mediaQuery(layer: any, ID: any) {
  const query = layer.createQuery();
  query.where = `id = ${ID}`;
  const final = layer.queryFeatures(query).then((result: any) => {
    const stats = result.features;
    const data = stats.map((item: any) => {
      return Object.assign({
        timestamp: Number(item.attributes["TimeStamp"]),
        path: item.attributes["Path"],
      });
    });
    data.sort((a: any, b: any) => a.timestamp - b.timestamp);
    return data;
  });
  return final;
}

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
  item.title === "Exterior Shell" ||
  item.title === "Bearings" ||
  item.title === "Specialty Equipment (Not Monitored)" ||
  item.title === "Structural Framing (Not Monitored)"
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
