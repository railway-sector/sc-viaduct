import { buildingLayer, s01Sublayers, viaductLayer } from "./layers";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer.js";
import { sublayerNames, viaSublayerTypes } from "./uniqueValues";

import type { StatusStateType } from "./uniqueValues";
import type { StatusTypenamesType } from "./uniqueValues";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import type BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import type SceneLayer from "@arcgis/core/layers/SceneLayer";
import { queryExpression } from "./QueryExpression";

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
  statusStateValue: any,
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

    //--- For Revit models ---//
    if (q1Value === "S-01") {
      const expression_revit = queryExpression({
        q1Value: q1Value,
        q1Field: q1Field,
        chartCategory: typeSelected,
        chartCategoryField: chartCategoryFieldRevit,
        status: statusStateValue,
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
      const expression_layer = queryExpression({
        q1Value: q1Value,
        q1Field: q1Field,
        chartCategory: typeSelected,
        chartCategoryField: chartCategoryFieldScene,
        chartCategoryType: "number",
        status: statusStateValue,
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
  statusStateValue: any,
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
    statusStateValue,
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
  statusStateValue?: any;
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
  statusStateValue,
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
        statusStateValue[index],
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
