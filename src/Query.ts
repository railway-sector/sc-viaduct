/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  buildingLayer,
  dateTable,
  pierNoLayer,
  s01Sublayers,
  viaductLayer,
  viaductLayerStatus4,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer.js";
import {
  sublayerNames,
  type_field_revit,
  viaSublayerTypes,
  viatypes,
} from "./uniqueValues";

import type { StatusStateType } from "./uniqueValues";
import type { StatusTypenamesType } from "./uniqueValues";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import type BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import type { TypeFieldType } from "./uniqueValues";
import type SceneLayer from "@arcgis/core/layers/SceneLayer";

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

//--------------------------------//
//    queryExpression             //
//--------------------------------//
interface queryExpressionType {
  q1Value?: any;
  q1Field?: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryType?: TypeFieldType;
  status?: number;
  statusField?: any;
  qExpression?: any;
}
export function queryExpression2({
  q1Value,
  q1Field,
  q2Value,
  q2Field,
  q3Value,
  q3Field,
  chartCategory,
  chartCategoryField,
  chartCategoryType,
  status,
  statusField,
  qExpression,
}: queryExpressionType) {
  //--- Basic query expression
  const query1 = `${q1Field} = '${q1Value}'`;
  const query2 = `${q2Field} = '${q2Value}'`;
  const query3 = `${q3Field} = '${q3Value}'`;
  const query12 = `${query1} AND ${query2}`;
  const query123 = `${query1} AND ${query2} AND ${query3}`;
  const q_status = `${statusField} = ${status}`;
  const q_chartC =
    chartCategoryType === "string"
      ? `${chartCategoryField} = '${chartCategory}'`
      : `${chartCategoryField} = ${chartCategory}`;
  const q_status_chartC = `${q_status} AND ${q_chartC}`;
  const query1_chartC = `${query1} AND ${q_chartC}`;
  const query12_chartC = `${query12} AND ${q_chartC}`;
  const query123_chartC = `${query123} AND ${q_chartC}`;
  const query1_status = `${query1} AND ${q_status}`;
  const query12_status = `${query12} AND ${q_status}`;
  const query123_status = `${query123} AND ${q_status}`;
  const query1_status_chartC = `${query1_status} AND ${q_chartC}`;
  const query12_status_chartC = `${query12_status} AND ${q_chartC}`;
  const query123_status_chartC = `${query123_status} AND ${q_chartC}`;

  //--- With qExpression
  const query1_qE = `${query1} AND ${qExpression}`;
  const query12_qE = `${query12} AND ${qExpression}`;
  const query123_qE = `${query123} AND ${qExpression}`;
  const q_status_qE = `${q_status} AND ${qExpression}`;
  const q_chartC_qE = `${q_chartC} AND ${qExpression}`;
  const q_status_chartC_qE = `${q_status_chartC} AND ${qExpression}`;
  const query1_chartC_qE = `${query1_chartC} AND ${qExpression}`;
  const query12_chartC_qE = `${query12_chartC} AND ${qExpression}`;
  const query123_chartC_qE = `${query123_chartC} AND ${qExpression}`;
  const query1_status_qE = `${query1_status} AND ${qExpression}`;
  const query12_status_qE = `${query12_status} AND ${qExpression}`;
  const query123_status_qE = `${query123_status} AND ${qExpression}`;
  const query1_status_chartC_qE = `${query1_status_chartC} AND ${qExpression}`;
  const query12_status_chartC_qE = `${query12_status_chartC} AND ${qExpression}`;
  const query123_status_chartC_qE = `${query123_status_chartC} AND ${qExpression}`;

  let expression = "";
  if (qExpression) {
    if (chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_chartC_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_chartC_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_chartC_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_chartC_qE;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_chartC_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_chartC_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_chartC_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_chartC_qE;
        }
      }
    } else if (!chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_qE;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = qExpression;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_qE;
        }
      }
    }
  } else if (!qExpression) {
    if (chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_chartC;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_chartC;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_chartC;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_chartC;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_chartC;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_chartC;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_chartC;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_chartC;
        }
      }
    } else if (!chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = "1=1";
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123;
        }
      }
    }
  }
  return expression;
}

//---------------------------------------------------------//
//    Definition Expression using queryExpression          //
//---------------------------------------------------------//
interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
}

export function queryDefinitionExpression2({
  queryExpression,
  featureLayer,
}: queryDefinitionExpressionType) {
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
            layer.visible = true;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
        featureLayer.visible = true;
      }
    }
  }
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

interface layerViewQueryType {
  layer?: any;
  categorySelected?: any;
  qExpression?: any;
  sublayerNames?: any;
  view: any;
  setLayerViewFilter?: any;
}

// BuildingLayer Sublayers
export const sublayersQuery = (
  chartCategoryTypes: any,
  categorySelected: any,
  expression: any,
  sublayersCollection: any,
) => {
  const modelNameSelected = chartCategoryTypes.find(
    (item: any) => item.category === categorySelected,
  )?.modelName;

  if (!modelNameSelected) {
    // 'Others'
    sublayersCollection.map((sublayer: any) => {
      sublayer.layer.definitionExpression = expression;
      sublayer.layer.visible = true;
    });
  } else {
    sublayersCollection.map((sublayer: any) => {
      if (sublayer.name === modelNameSelected) {
        sublayer.layer.definitionExpression = expression;
        sublayer.layer.visible = true;
      } else {
        sublayer.layer.visible = false;
      }
    });
  }
};

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
    sublayersQuery(
      viaSublayerTypes,
      categorySelected,
      qExpression,
      s01Sublayers,
    );

    if (sublayerView) {
      sublayerView.filter = new FeatureFilter({
        where: undefined,
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
  q1Value: any,
  q1Field: any,
  chartCategoryTypes: any,
  chartCategoryFieldRevit: any,
  chartCategoryFieldScene: any,
  sublayerNames: any,
  statusStatename: any,
  statusField: any,
  arcgisScene: any,
  setSublayerViewFilter: any, // useState
) {
  series.columns.template.events.on("click", (ev: any) => {
    const selected: any = ev.target.dataItem?.dataContext;
    const categorySelected: string = selected.category;
    const find = chartCategoryTypes.find(
      (emp: any) => emp.category === categorySelected,
    );
    const typeSelected = find?.value;
    const selectedStatus: number | null =
      statusStatename === "comp"
        ? 4
        : statusStatename === "ongoing"
          ? 2
          : statusStatename === "delayed"
            ? 3
            : 1;

    //--- For Revit models ---//
    if (q1Value === "S-01") {
      const expression_revit = queryExpression2({
        q1Value: q1Value,
        q1Field: q1Field,
        chartCategory: typeSelected,
        chartCategoryField: chartCategoryFieldRevit,
        status: selectedStatus,
        statusField: statusField,
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
      const expression_layer = queryExpression2({
        q1Value: q1Value,
        q1Field: q1Field,
        chartCategory: typeSelected,
        chartCategoryField: chartCategoryFieldScene,
        chartCategoryType: "number",
        status: selectedStatus,
        statusField: statusField,
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
  q1Value: any,
  q1Field: any,
  chartCategoryTypes: any,
  chartCategoryFieldRevit: any,
  chartCategoryFieldScene: any,
  data: any,
  statusTypename: any,
  statusStatename: any,
  statusField: any,
  xAxis: any,
  yAxis: any,
  legend: any,
  new_axisFontSize: any,
  seriesStatusColor: any,
  strokeColor: any,
  strokeWidth: any,
  arcgisScene: any,
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
    q1Value,
    q1Field,
    chartCategoryTypes,
    chartCategoryFieldRevit,
    chartCategoryFieldScene,
    sublayerNames,
    statusStatename,
    statusField,
    arcgisScene,
    setSublayerViewFilter,
  );

  legend.data.push(series);
}

//--- Chart Renderer
interface chartType {
  root: any;
  chart: any;
  data: any;
  q1Value: any;
  q1Field: any;
  chartCategoryTypes?: any;
  chartCategoryFieldRevit?: any;
  chartCategoryFieldScene?: any;
  // 'statusTypename' and 'statusStatename': E.g., you can add or delete status you wish to add in stacked columns.
  statusTypename: StatusTypenamesType[]; // order has no effect on statistics
  statusStatename: StatusStateType[]; // order affects the order displayed in stacked column charts
  statusField: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  arcgisScene: any;
  setClickedCategory?: any;
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
  q1Value,
  q1Field,
  chartCategoryTypes,
  chartCategoryFieldRevit,
  chartCategoryFieldScene,
  statusTypename,
  statusStatename,
  statusField,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  arcgisScene,
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
        q1Value,
        q1Field,
        chartCategoryTypes,
        chartCategoryFieldRevit,
        chartCategoryFieldScene,
        data,
        statustype,
        statusStatename[index],
        statusField,
        xAxis,
        yAxis,
        legend,
        new_axisFontSize,
        seriesStatusColor,
        strokeColor,
        strokeWidth,
        arcgisScene,
        setSublayerViewFilter,
      );
    });
}

interface layersRevitVisibilityType {
  layers: [
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingComponentSublayer?,
    BuildingSceneLayer?,
    SceneLayer?,
    FeatureLayer?,
  ];
}

export const resetAllLayers = ({ layers }: layersRevitVisibilityType) => {
  if (layers) {
    layers.map((layer: any) => {
      if (layer) {
        layer.layer.definitionExpression = "1=1";
        layer.layer.visible = true;
      }
    });
  }
};

//-------------------------------------//
//        Chart Data generation        //
//-------------------------------------//

//---- Building Layer ---//
interface chartDataGenerationType {
  q1Value: any;
  q1Field: any;
  chartCategoryTypes: any;
  layers: any;
  statusState: any;
}

export async function chartDataR(
  q1Value: any,
  q1Field: any,
  types_chosen: any,
  layer: any,
  statusState: any,
) {
  //--- types: include 'others'. Each main type may have others (types = 0)
  const compile: any = [];

  //--- Main statistics
  types_chosen.map((type: any) => {
    // [0, 1]
    statusState.map((status: any) => {
      // [1, 4]
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

  const expression = queryExpression2({
    q1Value: q1Value,
    q1Field: q1Field,
  });
  query.where = expression;
  queryDefinitionExpression2({
    queryExpression: expression,
    featureLayer: [pierNoLayer, viaductLayer],
  });

  //--- Query features using statistics definitions
  // Note the above order: [01, 04, 11, 14] = [type/status...]
  // Reorder for returned values: [11, 14, ]
  const qStats = layer?.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats[compile[4].outStatisticFieldName];
    const ongoing = stats[compile[5].outStatisticFieldName];
    const delayed = stats[compile[6].outStatisticFieldName];
    const comp = stats[compile[7].outStatisticFieldName];
    const others_incomp = stats[compile[0].outStatisticFieldName];
    const others_ongoing = stats[compile[1].outStatisticFieldName];
    const others_delayed = stats[compile[2].outStatisticFieldName];
    const others_comp = stats[compile[3].outStatisticFieldName];
    const total = incomp + ongoing + delayed + comp;
    const total_others =
      others_incomp + others_ongoing + others_delayed + others_comp;
    return [
      incomp,
      ongoing,
      delayed,
      comp,
      total,
      others_incomp,
      others_ongoing,
      others_delayed,
      others_comp,
      total_others,
    ];
  });
  return qStats;
}

export async function chartDataForRevit({
  q1Value,
  q1Field,
  chartCategoryTypes,
  layers,
  statusState,
}: chartDataGenerationType) {
  // [0, 1] = type['others', 'bored pile']
  let total_comp = 0;
  let total_all = 0;
  let total_others_incomp = 0;
  let total_others_ongoing = 0;
  let total_others_delayed = 0;
  let total_others_comp = 0;

  const data0 = chartCategoryTypes.map(async (type: any, index: any) => {
    if (type != "Others") {
      //--- Extract type value and icon from the sorce list
      const type_matched = viatypes.find((item) => item.category === type);

      //--- Calculate statistics
      const stats = await chartDataR(
        q1Value, // S-01
        q1Field,
        [0, type_matched?.value], // bored pile: [0, 1]
        layers[index], // bored pile: stFoundation
        statusState, // e.g., [1, 2, 3, 4]
      );

      //--- Extract others
      total_others_incomp += stats[5];
      total_others_ongoing += stats[6];
      total_others_delayed += stats[7];
      total_others_comp += stats[8];

      //--- Compute total numbers for completed and grand total
      total_comp += stats[3];
      total_all += stats[4];
      return Object.assign({
        category: type,
        comp: stats[3],
        incomp: stats[0],
        ongoing: stats[1],
        delayed: stats[2],
        icon: type_matched?.icon,
      });
    }
  });

  //--- Resolve Promise all
  const data = await Promise.all(data0);
  const progress =
    total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

  //--- Others
  const others = [
    {
      category: "Others",
      comp: total_others_comp,
      incomp: total_others_incomp,
      ongoing: total_others_ongoing,
      delayed: total_others_delayed,
      icon: viatypes[0].icon,
    },
  ];

  //-- Include others
  const updatedData = [...data, ...others];
  return [updatedData, total_all, progress];
}

//---- Multipatch (Scene) Layer ---//
interface queryBuildingLayersType {
  q1Value: any;
  q1Field: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  chartCategoryTypes?: any;
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryValueType?: TypeFieldType;
  layers:
    | [
        BuildingComponentSublayer,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
      ]
    | any;
  status?: number;
  statusState?: any;
  statusField?: any;
  qExpression?: any;
}

export async function chartDataQuery({
  q1Value: q1Value,
  q1Field: q1Field,
  layers: layers,
  statusState: statusState,
  statusField: statusField,
  qExpression: qExpression,
}: queryBuildingLayersType) {
  //--- types: include 'others'. Each main type may have others (types = 0)
  const compile: any = [];

  //--- Main statistics
  statusState.map((status: any) => {
    const temp = new StatisticDefinition({
      onStatisticField: `CASE WHEN ${statusField} = ${status} THEN 1 ELSE 0 END`,
      outStatisticFieldName: `stats${status}`,
      statisticType: "sum",
    });
    compile.push(temp);
  });

  //--- Query
  const query = new Query();
  query.outStatistics = compile;

  const expression = queryExpression2({
    q1Value: q1Value,
    q1Field: q1Field,
    qExpression: qExpression,
  });
  query.where = expression;

  //--- Query features using statistics definitions
  const qStats = layers?.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats[compile[0].outStatisticFieldName];
    const ongoing = stats[compile[1].outStatisticFieldName];
    const delayed = stats[compile[2].outStatisticFieldName];
    const comp = stats[compile[3].outStatisticFieldName];
    const total = incomp + ongoing + delayed + comp;

    return [incomp, comp, ongoing, delayed, total];
  });
  return qStats;
}

export async function chartDataStackColumns({
  q1Value: q1Value,
  q1Field: q1Field,
  layers: layers,
  chartCategoryTypes: chartCategoryTypes,
  chartCategoryField: chartCategoryField,
  chartCategoryValueType: chartCategoryValueType,
  statusState: statusState,
  statusField: statusField,
  qExpression: qExpression,
}: queryBuildingLayersType) {
  if (chartCategoryField) {
    // 1. Map through types and return a promise for each type
    const promises = chartCategoryTypes.map(async (type: any) => {
      let total_comp = 0;
      let total_incomp = 0;
      let total_ongoing = 0;
      let total_delayed = 0;

      // 2. Use Promise.all to wait for all statuses
      await Promise.all(
        statusState.map(async (status: any) => {
          const onStatisticField =
            chartCategoryValueType === "number"
              ? `CASE WHEN (${chartCategoryField} = ${type.value} AND ${statusField} = ${status}) THEN 1 ELSE 0 END`
              : `CASE WHEN (${chartCategoryField} = '${type.value}' AND ${statusField} = ${status}) THEN 1 ELSE 0 END`;

          const temp = new StatisticDefinition({
            onStatisticField: onStatisticField,
            outStatisticFieldName: "temp",
            statisticType: "sum",
          });

          const query = new Query();
          query.outStatistics = [temp];
          query.where = queryExpression2({
            q1Value: q1Value,
            q1Field: q1Field,
            qExpression: qExpression,
          });

          // 3. Await layer queries
          for (const layer of layers) {
            const response = await layer.queryFeatures(query);
            const stats = response.features[0]?.attributes;
            if (stats) {
              if (status === 1) total_incomp += stats["temp"] || 0;
              if (status === 2) total_ongoing += stats["temp"] || 0;
              if (status === 3) total_delayed += stats["temp"] || 0;
              if (status === 4) total_comp += stats["temp"] || 0;
            }
          }
        }),
      );

      // Return the compiled result for this type
      return {
        category: type.category,
        comp: total_comp,
        incomp: total_incomp,
        ongoing: total_ongoing,
        delayed: total_delayed,
      };
    });

    // 4. Wait for all type calculations to finish
    const results = await Promise.all(promises);
    const total_comp = results.reduce(
      (sum: any, item: any) => sum + item.comp,
      0,
    );
    const total_all = results.reduce(
      (sum: any, item: any) =>
        sum + item.comp + item.incomp + item.ongoing + item.delayed,
      0,
    );
    const progress =
      total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

    return [results, total_all, progress];
    //--------------------------//
    //    only status field     //
    //--------------------------//
  } else {
    let total_comp = 0;
    let total_all = 0;

    const data0 = chartCategoryTypes.map(async (type: any, index: any) => {
      //--- Calculate statistics
      const stats = await chartDataQuery({
        q1Value: q1Value,
        q1Field: q1Field,
        layers: layers[index],
        statusState: statusState,
        statusField: statusField,
        qExpression: qExpression,
      });

      //--- Compute total numbers for completed and grand total
      total_comp += stats[1];
      total_all += stats[4];

      return Object.assign({
        category: type.category,
        comp: stats[1],
        incomp: stats[0],
        ongoing: stats[2],
        delayed: stats[3],
      });
    });

    //--- Resolve Promise all
    const data = await Promise.all(data0);
    const progress =
      total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

    return [data, total_all, progress];
  }
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
  item.title === "Bearings" ||
  item.title === "Specialty Equipment (Not Monitored)" ||
  item.title === "Structural Framing (Not Monitored)"
    ? (item.visible = false)
    : (item.visible = true);
}

// Timeslider reset
export function layersTimeSliderReset(
  layer: any,
  field_name: any,
  new_date: any,
) {
  layer.definitionExpression = `${field_name} <= date '${new_date}'`;
}
