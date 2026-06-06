import { queryc2, viaductLayer } from "./layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import { cp_with_revit } from "./uniqueValues";

import type { StatusStateType } from "./uniqueValues";
import type { StatusTypenamesType } from "./uniqueValues";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

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
  chartCategoryTypes?: any;
  categorySelected?: any;
  qExpression?: any;
  sublayerNames?: any;
  view: any;
  sublayersCollection?: any;
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
  chartCategoryTypes,
  categorySelected,
  qExpression,
  sublayerNames,
  view,
  sublayersCollection,
  setLayerViewFilter, // useState
}: layerViewQueryType) => {
  view?.whenLayerView(layer).then((layerView: any) => {
    //--- Create sublayerview
    const sublayerView = layerView.sublayerViews.find((sublayerView: any) => {
      return sublayerView.sublayer.modelName === sublayerNames;
    });

    setLayerViewFilter(sublayerView);
    sublayersQuery(
      chartCategoryTypes,
      categorySelected,
      qExpression,
      sublayersCollection,
    );

    if (sublayerView) {
      sublayerView.filter = new FeatureFilter({
        where: undefined,
      });
    }
  });
};

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
interface clickSerisType {
  buildingLayer: any;
  series: any;
  q1Value?: any;
  q1Field?: any;
  chartCategoryTypes: any;
  chartCategoryFieldRevit: any;
  chartCategoryFieldScene?: any;
  statusStatename: any;
  statusArray: any;
  statusField: any;
  arcgisScene: any;
  sublayersCollection?: any;
  setSublayerViewFilter: any; // useState
  highlightedSublayerView?: any;
}

export function clickSeries({
  buildingLayer,
  series,
  q1Value,
  q1Field,
  chartCategoryTypes,
  chartCategoryFieldRevit,
  chartCategoryFieldScene,
  statusStatename,
  statusArray,
  statusField,
  arcgisScene,
  sublayersCollection,
  setSublayerViewFilter, // useState
}: clickSerisType) {
  series.columns.template.events.on("click", (ev: any) => {
    const selected: any = ev.target.dataItem?.dataContext;
    const categorySelected = chartCategoryTypes.find(
      (emp: any) => emp.category === selected.category,
    ).value;

    queryc2.qValues = [q1Value];
    queryc2.qFields = [q1Field];
    queryc2.chartCategory = categorySelected;
    queryc2.chartCategoryType = "number";
    queryc2.chartCategoryField = chartCategoryFieldRevit;
    queryc2.status = statusArray.find(
      (item: any) => item.status === statusStatename,
    ).value;
    queryc2.statusField = statusField;

    //--- For Revit models ---//
    if (cp_with_revit.includes(q1Value)) {
      const selectedSublayerName = chartCategoryTypes.find(
        (emp: any) => emp.value === categorySelected,
      )?.modelName;

      console.log(selectedSublayerName);

      //--- Hilight and Filter
      // Building sublayers
      highlightFilterBuildingSublayerView({
        layer: buildingLayer,
        chartCategoryTypes: chartCategoryTypes,
        categorySelected: categorySelected,
        qExpression: queryc2.queryExpression(),
        sublayerNames: selectedSublayerName,
        view: arcgisScene?.view,
        sublayersCollection: sublayersCollection,
        setLayerViewFilter: setSublayerViewFilter,
      });

      // Scenelayer or layer
    } else {
      queryc2.chartCategoryField = chartCategoryFieldScene;
      queryc2.chartCategoryType = "number";
      highlightFilterLayerView({
        layer: viaductLayer,
        qExpression: queryc2.queryExpression(),
        view: arcgisScene?.view,
      });
    }
  });
}

//--- Chart series
interface makeSerisType {
  root: any;
  chart: any;
  buildingLayer: any;
  data: any;
  q1Value?: any;
  q1Field?: any;
  chartCategoryTypes: any;
  chartCategoryFieldRevit: any;
  chartCategoryFieldScene?: any;
  statusTypename: any;
  statusStatename: any;
  statusArray: any;
  statusField: any;
  xAxis: any;
  yAxis: any;
  legend: any;
  new_axisFontSize: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  arcgisScene: any;
  sublayersCollection?: any;
  setSublayerViewFilter?: any;
  highlightedSublayerView?: any;
}

export function makeSeries({
  root,
  chart,
  buildingLayer,
  q1Value,
  q1Field,
  chartCategoryTypes,
  chartCategoryFieldRevit,
  chartCategoryFieldScene,
  data,
  statusTypename,
  statusStatename,
  statusArray,
  statusField,
  xAxis,
  yAxis,
  legend,
  new_axisFontSize,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  arcgisScene,
  sublayersCollection,
  setSublayerViewFilter,
}: makeSerisType) {
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
  clickSeries({
    buildingLayer: buildingLayer,
    series: series,
    q1Value: q1Value,
    q1Field: q1Field,
    chartCategoryTypes: chartCategoryTypes,
    chartCategoryFieldRevit: chartCategoryFieldRevit,
    chartCategoryFieldScene: chartCategoryFieldScene,
    statusStatename: statusStatename,
    statusArray: statusArray,
    statusField: statusField,
    arcgisScene: arcgisScene,
    sublayersCollection: sublayersCollection,
    setSublayerViewFilter: setSublayerViewFilter,
  });

  legend.data.push(series);
}

//--- Chart Renderer
interface chartType {
  root: any;
  chart: any;
  data: any;
  buildingLayer: any;
  q1Value: any;
  q1Field: any;
  chartCategoryTypes?: any;
  chartCategoryFieldRevit?: any;
  chartCategoryFieldScene?: any;
  // 'statusTypename' and 'statusStatename': E.g., you can add or delete status you wish to add in stacked columns.
  statusTypename: StatusTypenamesType[]; // order has no effect on statistics
  statusStatename: StatusStateType[]; // order affects the order displayed in stacked column charts
  statusArray: any;
  statusField: any;
  seriesStatusColor: any;
  strokeColor: any;
  strokeWidth: any;
  arcgisScene: any;
  setClickedCategory?: any;
  sublayersCollection?: any;
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
  buildingLayer,
  q1Value,
  q1Field,
  chartCategoryTypes,
  chartCategoryFieldRevit,
  chartCategoryFieldScene,
  statusTypename,
  statusStatename,
  statusArray,
  statusField,
  seriesStatusColor,
  strokeColor,
  strokeWidth,
  arcgisScene,
  sublayersCollection,
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
      makeSeries({
        root: root,
        chart: chart,
        buildingLayer: buildingLayer,
        q1Value: q1Value,
        q1Field: q1Field,
        chartCategoryTypes: chartCategoryTypes,
        chartCategoryFieldRevit: chartCategoryFieldRevit,
        chartCategoryFieldScene: chartCategoryFieldScene,
        data: data,
        statusTypename: statustype,
        statusStatename: statusStatename[index],
        statusArray: statusArray,
        statusField: statusField,
        xAxis: xAxis,
        yAxis: yAxis,
        legend: legend,
        new_axisFontSize: new_axisFontSize,
        seriesStatusColor: seriesStatusColor,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        arcgisScene: arcgisScene,
        sublayersCollection: sublayersCollection,
        setSublayerViewFilter: setSublayerViewFilter,
      });
    });
}

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
