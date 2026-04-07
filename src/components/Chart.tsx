/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState, use } from "react";
import {
  bearingsLayer,
  buildingLayer,
  decksLayer,
  pierNoLayer,
  piersLayer,
  stationLayer,
  stFoundationLayer,
  stFramingLayer,
  viaductLayer,
} from "../layers";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import {
  chartDataColumnSries,
  chartDataForRevit,
  chartRenderer,
  layersRevitVisibility,
  zoomToLayer,
} from "../Query";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-button";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import SubLayerView from "@arcgis/core/views/layers/BuildingComponentSublayerView";
import {
  status_field,
  type_field_layer,
  viaductStatusColorForChart,
  viatypes,
} from "../uniqueValues";

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
  const {
    contractpackages,
    updateChartPanelwidth,
    chartPanelwidth,
    updateLayersRevit,
    layersRevit,
  } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const [chartData, setChartData] = useState([]);
  const [progress, setProgress] = useState<number>(0);
  const [sublayerViewFilter, setSublayerViewFilter] = useState<
    SubLayerView | any
  >();
  const [resetButtonClicked, setResetButtonClicked] = useState<boolean>(false);
  const [categoryClicked, setCategoryClicked] = useState<string>("");

  const chartID = "viaduct-bar";

  //--- Store Building layers for filtering
  useEffect(() => {
    buildingLayer.when(() => {
      updateLayersRevit([
        {
          "S-01": [
            decksLayer,
            bearingsLayer,
            piersLayer,
            stFoundationLayer,
            bearingsLayer,
            stFramingLayer,
            buildingLayer,
          ],
        },
      ]);
    });
  }, []);

  useEffect(() => {
    if (contractpackages === "S-01") {
      viaductLayer.visible = false;
      buildingLayer.visible = true;

      chartDataForRevit(
        contractpackages,
        [
          viatypes[0].category,
          viatypes[1].category,
          viatypes[2].category,
          viatypes[3].category,
          viatypes[4].category,
          viatypes[6].category,
        ],
        [
          stFoundationLayer,
          stFoundationLayer,
          piersLayer,
          piersLayer,
          decksLayer,
          piersLayer,
        ],
        [1, 4], // 'To be Constructed', 'Completed'
      ).then((response: any) => {
        setChartData(response[0]);
        setProgress(response[2]);
      });
    } else {
      buildingLayer.visible = false;
      viaductLayer.visible = true;

      chartDataColumnSries({
        contractp: contractpackages,
        typeList: viatypes,
        typeField: type_field_layer,
        layer: viaductLayer,
        statusstate: [1, 2, 4],
        statusField: status_field,
        layerName: "viaduct",
      }).then((result: any) => {
        setChartData(result[0]);
        setProgress(result[3]);
      });
    }

    // stationLayer.definitionExpression = "CP = '" + contractpackages + "'";
    pierNoLayer.definitionExpression = "CP = '" + contractpackages + "'";
    zoomToLayer(stationLayer, arcgisScene);
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
        centerX: am5.percent(50),
        // centerY: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        // scale: 0.85,
        layout: root.horizontalLayout,
      }),
    );
    legendRef.current = legend;

    chartRenderer({
      root: root,
      chart: chart,
      data: chartData,
      contractcp: contractpackages,
      statusTypename: ["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp", "ongoing"],
      seriesStatusColor: viaductStatusColorForChart,
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      arcgisScene: arcgisScene,
      setClickedCategory: setCategoryClicked,
      setSublayerViewFilter: setSublayerViewFilter,
      new_chartIconSize: new_chartIconSize,
      new_axisFontSize: new_axisFontSize,
      chartIconPositionX: chartIconPositionX,
      chartPaddingRightIconLabel: chartPaddingRightIconLabel,
      legend: legend,
      updateChartPanelwidth: updateChartPanelwidth,
    });

    // chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  });

  useEffect(() => {
    if (sublayerViewFilter) {
      sublayerViewFilter.filter = new FeatureFilter({
        where: undefined,
      });

      layersRevitVisibility({ layers: layersRevit[0][contractpackages] });
    }

    if (categoryClicked === "Others") {
      layersRevitVisibility({ layers: layersRevit[0][contractpackages] });
    }
  }, [resetButtonClicked, categoryClicked]);

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
        {contractpackages === "S-01" && (
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
