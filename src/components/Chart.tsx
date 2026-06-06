import { useEffect, useRef, useState, use } from "react";
import {
  decksLayer,
  pierNoLayer,
  piersLayer,
  stFoundationLayer,
  s01Sublayers,
  viaductLayer,
  queryc,
  stFoundationLayer_s04,
  piersLayer_s04,
  decksLayer_s04,
  s04Sublayers,
} from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import { zoomToLayer } from "../Query";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-button";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import {
  chartCategoryTypesList,
  cp_field,
  cp_with_revit,
  status_field,
  type_field_layer,
  type_field_revit,
  viaductStatusColorForChart,
  viaStatusArray,
  viatypes,
} from "../uniqueValues";
import {
  chartDataForRevit,
  chartDataStackColumns,
} from "../ChartDataGenerator";
import { chartRenderer, resetAllLayers } from "../ChartRenderer";
import {
  queryDefinitionExpression,
  visibilityBuildingLayers,
  buildingSceneLayersCollection,
} from "../QueryExpression";

// Dispose function
function maybeDisposeRoot(divId: any) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id === divId) {
      root.dispose();
    }
  });
}

// Draw chart
const Chart = () => {
  const { contractpackages, updateChartPanelwidth, chartPanelwidth } =
    use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [chartData, setChartData] = useState([]);
  const [progress, setProgress] = useState<number>(0);
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);

  const chartID = "viaduct-bar";
  useEffect(() => {
    queryc.qValues = [contractpackages];
    queryc.qFields = [cp_field];

    //--- query and filter viaduct multipatch
    queryDefinitionExpression({
      queryExpression: queryc.queryExpression(),
      featureLayer: [pierNoLayer],
    });

    //-- Change visibility of building scene layers
    visibilityBuildingLayers({
      contractcp: contractpackages,
      layers: buildingSceneLayersCollection,
    });

    zoomToLayer(pierNoLayer, arcgisScene?.view);

    const sublayersc =
      contractpackages === "S-01"
        ? [
            stFoundationLayer, // bored pile
            stFoundationLayer, // pile cap
            piersLayer, // pier
            piersLayer, // pier head
            decksLayer, // precast
            piersLayer, // noiese barrier
          ]
        : contractpackages === "S-04"
          ? [
              stFoundationLayer_s04, // bored pile
              stFoundationLayer_s04, // pile cap
              piersLayer_s04, // pier
              piersLayer_s04, // pier head
              decksLayer_s04, // precast
            ]
          : null;

    //--- Viaduct Revit
    if (cp_with_revit.includes(contractpackages)) {
      //-- 'Others' is included as default
      chartDataForRevit({
        qChart: queryc.queryExpression(),
        chartCategoryTypes: chartCategoryTypesList.filter(
          (item: any) => item.cp === contractpackages,
        )[0].types,
        layers: sublayersc,
        statusState: [1, 2, 3, 4], // 'To be Constructed', 'Completed'
      }).then((response: any) => {
        setChartData(response[0]);
        setProgress(response[2]);
      });

      //--- Viaduct multipatch
    } else {
      queryDefinitionExpression({
        queryExpression: queryc.queryExpression(),
        featureLayer: [viaductLayer, pierNoLayer],
      });

      chartDataStackColumns({
        qChart: queryc.queryExpression(),
        chartCategoryTypes: viatypes,
        chartCategoryField: type_field_layer,
        chartCategoryValueType: "number",
        layers: [viaductLayer],
        statusState: [1, 2, 3, 4],
        statusField: status_field,
      }).then((result: any) => {
        setChartData(result[0]);
        setProgress(result[2]);
      });
    }
  }, [contractpackages]);

  // Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;
  const chartIconPositionX = -21;
  const chartPaddingRightIconLabel = 45;

  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;

  // ************************************
  //  Responsive Chart parameters
  // ***********************************
  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.035;
  // const new_resetfiler_buttonSize = chartPanelwidth * 0.05;

  // Utility Chart
  useEffect(() => {
    maybeDisposeRoot(chartID);

    const root = am5.Root.new(chartID);
    root.container.children.clear();
    root._logo?.dispose();

    // Set themesf
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Responsive.new(root),
    ]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingTop: paddingTop,
        paddingLeft: paddingLeft,
        paddingRight: paddingRight,
        paddingBottom: paddingBottom,
        scale: 1,
        height: am5.percent(100),
      }),
    );
    chartRef.current = chart;

    const legend = chart.children.push(
      am5.Legend.new(root, {
        marginTop: 15,
        scale: 0.9,
        layout: root.horizontalLayout,
      }),
    );
    legendRef.current = legend;

    const sublayersCollection =
      contractpackages === "S-01"
        ? s01Sublayers
        : contractpackages === "S-04"
          ? s04Sublayers
          : s01Sublayers;

    chartRenderer({
      root: root,
      chart: chart,
      data: chartData,
      buildingLayer: buildingSceneLayersCollection.find(
        (item: any) => item.cp === contractpackages,
      ).layer,
      q1Value: contractpackages,
      q1Field: cp_field,
      chartCategoryTypes: viatypes,
      chartCategoryFieldRevit: type_field_revit,
      chartCategoryFieldScene: type_field_layer,
      statusTypename: ["Completed", "To be Constructed", "Under Construction"], //["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp", "ongoing"], //["comp", "incomp", "ongoing"],
      statusArray: viaStatusArray,
      statusField: status_field,
      seriesStatusColor: viaductStatusColorForChart,
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      arcgisScene: arcgisScene,
      sublayersCollection: sublayersCollection,
      setSublayerViewFilter: setSublayerViewFilter,
      new_chartIconSize: new_chartIconSize,
      new_axisFontSize: new_axisFontSize,
      chartIconPositionX: chartIconPositionX,
      chartPaddingRightIconLabel: chartPaddingRightIconLabel,
      legend: legend,
      updateChartPanelwidth: updateChartPanelwidth,
    });

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  useEffect(() => {
    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });
    }
    contractpackages === "S-01"
      ? resetAllLayers({ layers: s01Sublayers })
      : resetAllLayers({ layers: s04Sublayers });
  }, [resetButtonClicked, contractpackages]);

  const primaryLabelColor = "#9ca3af";
  const valueLabelColor = "#d1d5db";
  return (
    <>
      <div
        slot="panel-end"
        style={{
          borderStyle: "solid",
          borderRightWidth: 5,
          borderLeftWidth: 5,
          borderBottomWidth: 5,
          // borderTopWidth: 5,
          borderColor: "#555555",
        }}
      >
        <div
          style={{
            display: "flex",
            marginTop: "3px",
            marginLeft: "15px",
            marginRight: "15px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <img
            src="https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_All_Logo.svg"
            alt="Land Logo"
            height={`${new_imageSize}%`}
            width={`${new_imageSize}%`}
            style={{ paddingTop: "20px", paddingLeft: "15px" }}
          />
          <dl style={{ alignItems: "center" }}>
            <dt
              style={{
                color: primaryLabelColor,
                fontSize: `${new_fontSize}px`,
                marginRight: "35px",
              }}
            >
              TOTAL PROGRESS
            </dt>
            <dd
              style={{
                color: valueLabelColor,
                fontSize: `${new_valueSize}px`,
                fontWeight: "bold",
                fontFamily: "calibri",
                lineHeight: "1.2",
                margin: "auto",
              }}
            >
              {progress} %
            </dd>
          </dl>
        </div>
        <div
          id={chartID}
          style={{
            height: contractpackages === "S-01" ? "65vh" : "70vh",
            // width: "26vw",
            backgroundColor: "rgb(0,0,0,0)",
            color: "white",
            marginRight: "10px",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        ></div>
        {(contractpackages === "S-01" || contractpackages === "S-04") && (
          <div
            id="filterButton"
            style={{
              // width: "50%",
              marginLeft: "30%",
              marginTop: "10%",
            }}
          >
            <calcite-button
              iconEnd="reset"
              onClick={() =>
                setResetButtonClicked(
                  resetButtonClicked === false ? true : false,
                )
              }
            >
              Reset Chart Filter
            </calcite-button>
          </div>
        )}
      </div>
    </>
  );
};

export default Chart;
