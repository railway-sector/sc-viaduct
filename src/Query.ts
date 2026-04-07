/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  bearingsLayer,
  buildingLayer,
  dateTable,
  decksLayer,
  pierNoLayer,
  piersLayer,
  specialtyEquipmentLayer,
  stFoundationLayer,
  stFramingLayer,
  viaductLayer,
  viaductLayerStatus4,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer.js";
import {
  cp_field,
  status_field,
  sublayerNames,
  type_field_layer,
  type_field_revit,
  viatypes,
} from "./uniqueValues";

import type { StatusStateType } from "./uniqueValues";
import type { StatusTypenamesType } from "./uniqueValues";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import type BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import type { LayerNameType } from "./uniqueValues";
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

// ****************************
//    Chart Parameters
// ****************************
//-- Responsve parameters
export function responsiveChart(chart: any, legend: any) {
  chart.onPrivate("width", (width: any) => {
    const availableSpace = width * 0.35; // original 0.7
    const new_fontSize = width / 35;

    legend.labels.template.setAll({
      fill: am5.color("#ffffff"),
      fontSize: new_fontSize,
    });

    legend.itemContainers.template.setAll({
      width: availableSpace,
      marginLeft: 10,
      marginRight: 10,
    });
  });
}

//--- LayerView Filter and Highlight
interface layerViewQueryType {
  layer?: any;
  categorySelected?: any;
  qExpression?: any;
  sublayerNames?: any;
  view: any;
  setLayerViewFilter?: any;
}

// BuildingLayer Sublayers
export const highlightFilterBuildingSublayerView = ({
  layer,
  categorySelected,
  qExpression,
  sublayerNames,
  view,
  setLayerViewFilter, // useState
}: layerViewQueryType) => {
  view?.whenLayerView(layer).then((layerView: any) => {
    //--- Create sublayerview
    const sublayerView = layerView.sublayerViews.find((sublayerView: any) => {
      return sublayerView.sublayer.modelName === sublayerNames;
    });

    setLayerViewFilter(sublayerView);
    s01_sublayersVisibility(categorySelected, qExpression);

    if (sublayerView) {
      sublayerView.filter = new FeatureFilter({
        where: qExpression,
      });
    }
  });
};

interface layerViewQueryType {
  layer?: any;
  qExpression?: any;
  view: any;
}
// FeatureLayer or SceneLayer
export const highlightFilterLayerView = ({
  layer,
  qExpression,
  view,
}: layerViewQueryType) => {
  const query = layer.createQuery();
  query.where = qExpression;
  let highlightSelect: any;

  view?.whenLayerView(layer).then((layerView: any) => {
    layer?.queryObjectIds(query).then((results: any) => {
      const objID = results;

      highlightSelect && highlightSelect.remove();
      highlightSelect = layerView.highlight(objID);
    });

    layerView.filter = new FeatureFilter({
      where: qExpression,
    });

    // For initial state, we need to add this
    view?.on("click", () => {
      layerView.filter = new FeatureFilter({
        where: undefined,
      });
      highlightSelect && highlightSelect.remove();
    });
  });
};

//--- Click event on series
export function clickSeries(
  series: any,
  contractcp: any,
  sublayerNames: any,
  statusStatename: any,
  arcgisScene: any,
  setClickedCategory: any, // useState
  setSublayerViewFilter: any, // useState
) {
  series.columns.template.events.on("click", (ev: any) => {
    const selected: any = ev.target.dataItem?.dataContext;
    const categorySelected: string = selected.category;
    const find = viatypes.find((emp: any) => emp.category === categorySelected);
    const typeSelected = find?.value;
    const selectedStatus: number | null =
      statusStatename === "comp"
        ? 4
        : statusStatename === "ongoing"
          ? 2
          : statusStatename === "delayed"
            ? 3
            : 1;

    //--- Store clicked category
    setClickedCategory(categorySelected);

    //--- For Revit models ---//
    if (contractcp === "S-01") {
      const expression_revit = queryExpression({
        contractcp: contractcp,
        type: typeSelected,
        status: selectedStatus,
        queryField: undefined,
        layerType: "buildingSublayer",
      });

      //--- Find sublayer
      const selectedSublayerName = sublayerNames.find(
        (emp: any) => emp.category === categorySelected,
      )?.modelName;

      //--- Hilight and Filter
      // Building sublayers
      highlightFilterBuildingSublayerView({
        layer: buildingLayer,
        categorySelected: categorySelected,
        qExpression: expression_revit,
        sublayerNames: selectedSublayerName,
        view: arcgisScene?.view,
        setLayerViewFilter: setSublayerViewFilter,
      });

      // Scenelayer or layer
    } else {
      const expression_layer = queryExpression({
        contractcp: contractcp,
        type: typeSelected,
        status: selectedStatus,
      });

      highlightFilterLayerView({
        layer: viaductLayer,
        qExpression: expression_layer,
        view: arcgisScene?.view,
      });
    }
  });
}

//--- Chart series
export function makeSeries(
  root: any,
  chart: any,
  contractcp: any,
  data: any,
  statusTypename: any,
  statusStatename: any,
  xAxis: any,
  yAxis: any,
  legend: any,
  new_axisFontSize: any,
  seriesStatusColor: any,
  strokeColor: any,
  strokeWidth: any,
  arcgisScene: any,
  setClickedCategory: any,
  setSublayerViewFilter: any,
) {
  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: statusTypename,
      stacked: true,
      xAxis: xAxis,
      yAxis: yAxis,
      baseAxis: yAxis,
      valueXField: statusStatename,
      valueXShow: "valueXTotalPercent",
      categoryYField: "category",
      fill:
        statusStatename === "incomp"
          ? am5.color(seriesStatusColor[0])
          : statusStatename === "comp"
            ? am5.color(seriesStatusColor[3])
            : statusStatename === "delayed"
              ? am5.color(seriesStatusColor[2])
              : am5.color(seriesStatusColor[1]),
      stroke: am5.color(strokeColor),
    }),
  );

  series.columns.template.setAll({
    fillOpacity: statusStatename === "comp" ? 1 : 0.5,
    tooltipText: "{name}: {valueX}", // "{categoryY}: {valueX}",
    tooltipY: am5.percent(90),
    strokeWidth: strokeWidth,
  });
  series.data.setAll(data);

  series.appear();

  series.bullets.push(() => {
    return am5.Bullet.new(root, {
      sprite: am5.Label.new(root, {
        text:
          statusStatename === "incomp"
            ? ""
            : "{valueXTotalPercent.formatNumber('#.')}%", //"{valueX}",
        fill: root.interfaceColors.get("alternativeText"),
        opacity: statusStatename === "incomp" ? 0 : 1,
        fontSize: new_axisFontSize,
        centerY: am5.p50,
        centerX: am5.p50,
        populateText: true,
      }),
    });
  });

  // Click series
  clickSeries(
    series,
    contractcp,
    sublayerNames,
    statusStatename,
    arcgisScene,
    setClickedCategory,
    setSublayerViewFilter,
  );

  legend.data.push(series);
}

//--- Chart Renderer

interface chartType {
  root: any;
  chart: any;
  data: any;
  contractcp: any;
  // 'statusTypename' and 'statusStatename': E.g., you can add or delete status you wish to add in stacked columns.
  statusTypename: StatusTypenamesType[]; // order has no effect on statistics
  statusStatename: StatusStateType[]; // order affects the order displayed in stacked column charts
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  arcgisScene: any;
  setClickedCategory: any;
  setSublayerViewFilter: any;
  new_chartIconSize: any;
  new_axisFontSize: any;
  chartIconPositionX: any;
  chartPaddingRightIconLabel: any;
  legend: any;
  updateChartPanelwidth: any;
}
export function chartRenderer({
  root,
  chart,
  data,
  contractcp,
  statusTypename,
  statusStatename,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  arcgisScene,
  setClickedCategory,
  setSublayerViewFilter,
  new_chartIconSize,
  new_axisFontSize,
  chartIconPositionX,
  chartPaddingRightIconLabel,
  legend,
  updateChartPanelwidth,
}: chartType) {
  // Axis Renderer
  const yRenderer = am5xy.AxisRendererY.new(root, {
    inversed: true,
  });

  //--- yAxix
  const yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: yRenderer,
      bullet: function (root: any, _axis: any, dataItem: any) {
        return am5xy.AxisBullet.new(root, {
          location: 0.5,
          sprite: am5.Picture.new(root, {
            width: new_chartIconSize,
            height: new_chartIconSize,
            centerY: am5.p50,
            centerX: am5.p50,
            x: chartIconPositionX,
            src: dataItem.dataContext.icon,
          }),
        });
      },
      tooltip: am5.Tooltip.new(root, {}),
    }),
  );

  yRenderer.labels.template.setAll({
    paddingRight: chartPaddingRightIconLabel,
  });

  yRenderer.grid.template.setAll({
    location: 1,
  });

  yAxis.get("renderer").labels.template.setAll({
    oversizedBehavior: "wrap",
    textAlign: "center",
    fill: am5.color("#ffffff"),
    //maxWidth: 150,
    fontSize: new_axisFontSize,
  });
  yAxis.data.setAll(data);

  //--- xAxix
  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      calculateTotals: true,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0,
        strokeWidth: 1,
        stroke: am5.color("#ffffff"),
      }),
    }),
  );

  xAxis.get("renderer").labels.template.setAll({
    //oversizedBehavior: "wrap",
    textAlign: "center",
    fill: am5.color("#ffffff"),
    //maxWidth: 150,
    fontSize: new_axisFontSize,
  });

  //--- Responsive Chart
  responsiveChart(chart, legend);
  chart.onPrivate("width", (width: any) => {
    updateChartPanelwidth(width);
  });

  //--- Make Series
  statusTypename &&
    statusTypename.map((statustype: any, index: any) => {
      makeSeries(
        root,
        chart,
        contractcp,
        data,
        statustype,
        statusStatename[index],
        xAxis,
        yAxis,
        legend,
        new_axisFontSize,
        seriesStatusColor,
        strokeColor,
        strokeWidth,
        arcgisScene,
        setClickedCategory,
        setSublayerViewFilter,
      );
    });
}

// ****************************
//    Segmented list Parameters
// ****************************
interface queryExpressionType {
  contractcp?: string;
  type?: number;
  status?: number;
  queryField?: any;
  layerType?: "buildingSublayer" | "sceneLayer";
}

export function queryExpression({
  contractcp,
  type,
  status,
  queryField,
  layerType,
}: queryExpressionType) {
  let expression = "";

  const cp_query = `${cp_field} = '${contractcp}'`;
  const type_query_revit = `${type_field_revit} = ${type}`;
  const type_query_layer = `${type_field_layer} = ${type}`;
  const status_query = `${status_field} = ${status}`;

  // With queryField
  const cptypeQuery_revit =
    `${cp_query} AND ${type_query_revit}` + " AND " + queryField;
  const cptypeQuery_layer =
    `${cp_query} AND ${type_query_layer}` + " AND " + queryField;
  const cptypestatusQuery_revit =
    `${cp_query} AND ${type_query_revit} AND ${status_query}` +
    " AND " +
    queryField;
  const cptypestatusQuery_layer =
    `${cp_query} AND ${type_query_layer} AND ${status_query}` +
    " AND " +
    queryField;

  // Without queryField
  const cptype_revit = `${cp_query} AND ${type_query_revit}`;
  const cptype_layer = `${cp_query} AND ${type_query_layer}`;
  const cptypestatus_revit = `${cp_query} AND ${type_query_revit} AND ${status_query}`;
  const cptypestatus_layer = `${cp_query} AND ${type_query_layer} AND ${status_query}`;

  if (queryField) {
    if (!contractcp && !type && !status) {
      expression = "1=1" + " AND " + queryField;
    } else if (contractcp && !type && !status) {
      expression = cp_query + " AND " + queryField;
    } else if (contractcp && type && !status) {
      expression =
        layerType === "buildingSublayer"
          ? cptypeQuery_revit
          : cptypeQuery_layer;
    } else if (contractcp && type && status) {
      expression =
        layerType === "buildingSublayer"
          ? cptypestatusQuery_revit
          : cptypestatusQuery_layer;
    }
  } else {
    if (!contractcp && !type && !status) {
      expression = "1=1";
    } else if (contractcp && !type && !status) {
      expression = cp_query;
    } else if (contractcp && type && !status) {
      expression =
        layerType === "buildingSublayer" ? cptype_revit : cptype_layer;
    } else if (
      (contractcp && type && status) ||
      (contractcp && type === 0 && status)
    ) {
      expression =
        layerType == "buildingSublayer"
          ? cptypestatus_revit
          : cptypestatus_layer;
    }
  }
  return expression;
}

interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
  builindgSubLayer?:
    | [
        BuildingComponentSublayer,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
      ]
    | BuildingComponentSublayer;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
  builindgSubLayer,
}: queryDefinitionExpressionType) {
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
      }
    } else if (builindgSubLayer) {
      if (Array.isArray(builindgSubLayer)) {
        builindgSubLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
          }
        });
      } else {
        builindgSubLayer.definitionExpression = queryExpression;
      }
    }
  } else {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = "1=1";
          }
        });
      } else {
        featureLayer.definitionExpression = "1=1";
      }
    } else if (builindgSubLayer) {
      if (Array.isArray(builindgSubLayer)) {
        builindgSubLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = "1=1";
          }
        });
      } else {
        builindgSubLayer.definitionExpression = "1=1";
      }
    }
  }
}

interface layersRevitVisibilityType {
  layers: [
    BuildingComponentSublayer,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingSceneLayer?,
  ];
}

export const layersRevitVisibility = ({
  layers,
}: layersRevitVisibilityType) => {
  if (layers) {
    layers.map((layer: any) => {
      if (layer) {
        layer.definitionExpression = "1=1";
        layer.visible = true;
      }
    });
  }
};

//--- Revit Chart Data generation
export async function chartDataR(
  contractp: any,
  types: any,
  layer: any,
  statusstate: any,
) {
  //--- types: include 'others'. Each main type may have others (types = 0)
  const compile: any = [];

  //--- Main statistics
  types.map((type: any) => {
    statusstate.map((status: any) => {
      const temp = new StatisticDefinition({
        onStatisticField: `CASE WHEN (${type_field_revit} = ${type} and Status = ${status}) THEN 1 ELSE 0 END`,
        outStatisticFieldName: `viaduct_stats${type}${status}`,
        statisticType: "sum",
      });
      compile.push(temp);
    });
  });

  //--- Query
  const query = new Query();
  query.outStatistics = compile;

  const expression = queryExpression({
    contractcp: contractp,
  });
  query.where = expression;
  queryDefinitionExpression({
    queryExpression: expression,
    featureLayer: [pierNoLayer, viaductLayer],
  });

  //--- Query features using statistics definitions
  // Note the above order: [01, 04, 11, 14] = [type/status...]
  // Reorder for returned values: [11, 14, ]
  const qStats = layer?.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats[compile[2].outStatisticFieldName];
    const comp = stats[compile[3].outStatisticFieldName];
    const others_incomp = stats[compile[0].outStatisticFieldName];
    const others_comp = stats[compile[1].outStatisticFieldName];
    const total = incomp + comp;
    const total_others = others_incomp + others_comp;
    return [incomp, comp, total, others_incomp, others_comp, total_others];
  });
  return qStats;
}

export async function chartDataForRevit(
  contractcp: any,
  via_types_chosen: any,
  layers: any,
  statusstate: any,
) {
  // [0, 1] = type['others', 'bored pile']
  let total_comp = 0;
  let total_all = 0;
  const data0 = via_types_chosen.map(async (type: any, index: any) => {
    //--- Extract type value and icon from the sorce list
    const type_matched = viatypes.find((item) => item.category === type);

    //--- Calculate statistics
    const stats = await chartDataR(
      contractcp,
      [0, type_matched?.value],
      layers[index],
      statusstate,
    );

    //--- Compute total numbers for completed and grand total
    total_comp += stats[1];
    total_all += stats[2];
    return Object.assign({
      category: type,
      comp: stats[1],
      incomp: stats[0],
      icon: type_matched?.icon,
    });
  });

  //--- Resolve Promise all
  const data = await Promise.all(data0);
  const progress =
    total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

  return [data, total_all, progress];
}

//--- Multipatch Chart Data generation
interface chartDataColumnSeriesType {
  contractp: any;
  typeList: any;
  typeField: any;
  layer: any;
  statusstate: any;
  statusField: any;
  layerName: LayerNameType;
}
export async function chartDataColumnSries({
  contractp,
  typeList,
  typeField,
  layer,
  statusstate,
  statusField,
  layerName,
}: chartDataColumnSeriesType) {
  //--- types: include 'others'. Each main type may have others (types = 0)
  const compile: any = [];

  //--- Main statistics
  typeList.map((type: any) => {
    statusstate.map((status: any) => {
      const temp = new StatisticDefinition({
        onStatisticField: `CASE WHEN (${typeField} = ${type.value} and ${statusField} = ${status}) THEN 1 ELSE 0 END`,
        outStatisticFieldName: `stats${type.value}${status}`,
        statisticType: "sum",
      });
      compile.push(temp);
    });
  });

  //--- Query
  const query = new Query();
  query.outStatistics = compile;

  const expression = queryExpression({
    contractcp: contractp,
  });
  query.where = expression;
  queryDefinitionExpression({
    queryExpression: expression,
    featureLayer: [layer],
  });

  //--- Query features using statistics definitions
  let total_comp = 0;
  let total_all = 0;
  const qStats = layer?.queryFeatures(query).then(async (response: any) => {
    const stats = response.features;
    return typeList.map((type: any, index: any) => {
      if (layerName === "utility") {
        const comp = stats[0].attributes[`stats${type.value}${1}`];
        const incomp = stats[0].attributes[`stats${type.value}${0}`];

        total_comp += comp; //
        total_all += comp + incomp;

        return Object.assign({
          category: typeList[index].category,
          comp: comp,
          incomp: incomp,
          icon: typeList[index].icon,
        });
      } else if (layerName === "viaduct") {
        const comp = stats[0].attributes[`stats${type.value}${4}`];
        const incomp = stats[0].attributes[`stats${type.value}${1}`];
        const ongoing = stats[0].attributes[`stats${type.value}${2}`];

        total_comp += comp; //
        total_all += comp + incomp;

        return Object.assign({
          category: typeList[index].category,
          comp: comp,
          incomp: incomp,
          ongoing: ongoing,
          icon: typeList[index].icon,
        });
      }
    });
  });
  const data = await qStats;
  const percent_comp = ((total_comp / total_all) * 100).toFixed(0);

  return [data, total_comp, total_all, percent_comp];
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
  item.title === "Specialty Equipment (Not Monitored)" ||
  item.title === "Structural Framing (Not Monitored)"
    ? (item.visible = false)
    : (item.visible = true);
}

// Set invisible layers
export const s01_sublayersVisibility = (
  categorySelected: any,
  expression: any,
) => {
  if (
    categorySelected === viatypes[0].category ||
    categorySelected === viatypes[1].category
  ) {
    stFoundationLayer.definitionExpression = expression;
    stFoundationLayer.visible = true;
    stFramingLayer.visible = false;
    bearingsLayer.visible = false;
    piersLayer.visible = false;
    decksLayer.visible = false;
  } else if (
    categorySelected === viatypes[2].category ||
    categorySelected === viatypes[3].category ||
    categorySelected === viatypes[6].category
  ) {
    piersLayer.definitionExpression = expression;
    piersLayer.visible = true;
    stFramingLayer.visible = false;
    bearingsLayer.visible = false;
    stFoundationLayer.visible = false;
    decksLayer.visible = false;
    specialtyEquipmentLayer.visible = false;
  } else if (categorySelected === viatypes[4].category) {
    decksLayer.definitionExpression = expression;
    decksLayer.visible = true;
    specialtyEquipmentLayer.visible = false;
    bearingsLayer.visible = false;
    stFoundationLayer.visible = false;
    piersLayer.visible = false;
    stFramingLayer.visible = false;
  } else if (categorySelected === "Others") {
    decksLayer.definitionExpression = expression;
    bearingsLayer.definitionExpression = expression;
    piersLayer.definitionExpression = expression;
    stFoundationLayer.definitionExpression = expression;
    decksLayer.visible = true;
    bearingsLayer.visible = true;
    piersLayer.visible = true;
    stFoundationLayer.visible = true;
    stFramingLayer.visible = false; // not part of monitoring
    specialtyEquipmentLayer.visible = false; // not part of monitoring
  }
};

// Timeslider reset
export function layersTimeSliderReset(
  layer: any,
  field_name: any,
  new_date: any,
) {
  layer.definitionExpression = `${field_name} <= date '${new_date}'`;
}
