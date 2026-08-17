import { useEffect, useRef, useState, use, memo } from "react";
import {
  pierNoLayer,
  viaductLayer,
  viaductLayers_all,
  sublayers_all,
} from "../layers";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { resetAllLayers, zoomToLayer } from "../query";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-button";
import { ArcgisScene } from "@arcgis/map-components/dist/components/arcgis-scene";
import { MyContext } from "../contexts/MyContext";
import {
  cp_f,
  cp_with_revit,
  status_f,
  type_layer_f,
  type_revit_f,
  viastatus_q,
  viatypes_q,
} from "../uniqueValues";
import {
  queryDefinitionExpression,
  visibilityBuildingLayers,
} from "../queryExpression";
import { useQuery } from "@tanstack/react-query";
import { legendSetter, rootSetter } from "../chartSetter";
import ChartStackColumnRender, { resetQuerc } from "chart-stack-column-render";
import ChartStackColumns from "chart-stack-column";
import QueryExpressionLayers from "query-layers-expression";

export interface ChartResponse {
  chartData: any[];
  totalNumber: number | string | undefined;
}

//-----------------------//
//     usetViaductData   //
//-----------------------//
function useViaductData(cpackage: string, query: any, revitRef: any) {
  return useQuery<ChartResponse | any>({
    //-- Adding viaduct layer as a dependency forces re-rendering.
    queryKey: [cpackage, viaductLayer, query, status_f],
    queryFn: async () => {
      //-- Reset queryc
      resetQuerc(query);

      queryDefinitionExpression({
        queryExpression: query.queryExpression(),
        featureLayer: [pierNoLayer],
      });

      //-- Change visibility of building scene layers
      visibilityBuildingLayers({
        contractcp: cpackage,
        layers: viaductLayers_all,
      });

      let chartData: any;

      //--- Viaduct Revit
      if (revitRef.current) {
        const sublayersArray = sublayers_all[cpackage].map((f: any) => f.layer);

        chartData = await new ChartStackColumns({
          where: query,
          categoryTypes: viatypes_q,
          categoryTypeField: type_revit_f,
          layers: sublayersArray,
          statusField: status_f,
          statusState: [1, 2, 3, 4],
        }).chartDataStackColumns();

        //--- Viaduct multipatch
      } else {
        queryDefinitionExpression({
          queryExpression: query.queryExpression(),
          featureLayer: [viaductLayer, pierNoLayer],
        });

        chartData = await new ChartStackColumns({
          where: query,
          categoryTypes: viatypes_q,
          categoryTypeField: type_layer_f,
          layers: [viaductLayer],
          statusField: status_f,
          statusState: [1, 2, 3, 4],
        }).chartDataStackColumns();
      }

      return {
        chartData: chartData[0] || [],
        perc_comp: chartData[2] || 0,
      };
    },
    staleTime: Infinity,
  });
}

// Draw chart
const Chart = memo(() => {
  const { cpackage } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  //--- Declare React hooks
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [resetLayerview, setResetLayerview] = useState<boolean>(false);

  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const revitRef = useRef<boolean>(true);
  const chartID = "viaduct-bar";

  //--- Common qValues and qFields for QueryExpressionLayers class
  const q1 = new QueryExpressionLayers({
    qFields: [cp_f],
    qValues: [cpackage === "All" ? undefined : cpackage],
  });

  //--- Update cpackage goes with revit or multipatch
  revitRef.current = cp_with_revit.includes(cpackage) ? true : false;

  //--- Chart data
  const { data, isLoading } = useViaductData(cpackage, q1, revitRef);
  const chartData = data?.chartData || [];
  const perc_comp = data?.perc_comp || 0;

  //--- Define parameters
  const marginTop = 0;
  const marginLeft = 0;
  const marginRight = 0;
  const marginBottom = 0;
  const paddingTop = 10;
  const paddingLeft = 5;
  const paddingRight = 5;
  const paddingBottom = 0;
  const chartIconPositionX = undefined;
  const chartPaddingRightIconLabel = 15;
  const chartBorderLineColor = "#00c5ff";
  const chartBorderLineWidth = 0.4;

  const new_fontSize = chartPanelwidth / 20;
  const new_valueSize = new_fontSize * 1.55;
  const new_chartIconSize = chartPanelwidth * 0.07;
  const new_axisFontSize = chartPanelwidth * 0.036;
  const new_imageSize = chartPanelwidth * 0.035;

  const zoomFiltersRef = useRef(`${cpackage}`);

  useEffect(() => {
    const currentZoomFilters = `${cpackage}`;

    if (currentZoomFilters !== zoomFiltersRef.current) {
      zoomFiltersRef.current = currentZoomFilters;
      zoomToLayer(pierNoLayer, arcgisScene?.view);
    }

    const root = rootSetter({ chartID: chartID });
    root.setThemes([]);

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

    const legend = legendSetter({
      chart: chart,
      root: root,
      marginTop: 15,
      scale: 0.9,
      layout: root.horizontalLayout,
    });
    legendRef.current = legend;

    // stackColumnChartRender
    new ChartStackColumnRender({
      revit: revitRef.current,
      layers: revitRef.current ? sublayers_all[cpackage] : [viaductLayer],
      root,
      chart,
      data: chartData,
      buildingLayer: revitRef.current ? viaductLayers_all[cpackage] : undefined,
      where: q1,
      chartCategoryTypes: viatypes_q,
      chartCategoryTypeField: revitRef.current ? type_revit_f : type_layer_f,
      statusTypename: ["Completed", "To be Constructed", "Under Construction"], //["Completed", "To be Constructed", "Under Construction"],
      statusStatename: ["comp", "incomp", "ongoing"], //["comp", "incomp", "ongoing"],
      statusArray: viastatus_q,
      statusField: status_f,
      seriesStatusColor: viastatus_q.map((c: any) => c.color),
      strokeColor: chartBorderLineColor,
      strokeWidth: chartBorderLineWidth,
      view: arcgisScene?.view,
      new_chartIconSize,
      new_axisFontSize,
      chartIconPositionX,
      chartPaddingRightIconLabel,
      legend,
      updateChartPanelwidth: setChartPanelwidth,
    }).chartRendererColumn();

    return () => {
      root.dispose();
    };
  }, [cpackage, chartData]);

  useEffect(() => {
    resetAllLayers({ layers: sublayers_all[cpackage] });
  }, [resetLayerview, cpackage]);

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
            style={{
              paddingTop: "20px",
              paddingLeft: "15px",
              opacity: isLoading ? 0 : 1,
            }}
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
                opacity: isLoading ? 0 : 1,
              }}
            >
              {perc_comp} %
            </dd>
          </dl>
        </div>
        <div
          id={chartID}
          style={{
            width: "24vw",
            height: cp_with_revit.includes(cpackage) ? "67vh" : "73vh",
            backgroundColor: "rgb(0,0,0,0)",
            color: "white",
            marginRight: "20px",
            marginLeft: "10px",
            marginTop: "10px",
            opacity: isLoading ? 0 : 1,
          }}
        ></div>
        {cp_with_revit.includes(cpackage) && (
          <div
            id="filterButton"
            style={{
              marginLeft: "30%",
              marginTop: "5%",
            }}
          >
            <calcite-button
              iconEnd="reset"
              onClick={() => setResetLayerview(!resetLayerview)}
            >
              Reset Chart Filter
            </calcite-button>
          </div>
        )}
      </div>
    </>
  );
});

export default Chart;
