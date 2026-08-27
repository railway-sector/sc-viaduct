import { useEffect, useRef, useState, use } from "react";
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
import { PackageContext } from "../contexts/PackageContext";
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

const CHART_ID = "viaduct-bar";

// Static layout constants (do not depend on props/state, so hoisted out of the component)
const CHART_MARGINS = {
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  marginBottom: 0,
};
const CHART_PADDING = {
  paddingTop: 10,
  paddingLeft: 5,
  paddingRight: 5,
  paddingBottom: 0,
};
const CHART_ICON_POSITION_X = undefined;
const CHART_PADDING_RIGHT_ICON_LABEL = 15;
const CHART_BORDER_LINE_COLOR = "#00c5ff";
const CHART_BORDER_LINE_WIDTH = 0.4;
const STATUS_TYPE_NAMES: any[] = [
  "Completed",
  "To be Constructed",
  "Under Construction",
];
const STATUS_STATE_NAMES: any[] = ["comp", "incomp", "ongoing"];

//-----------------------//
//     usetViaductData   //
//-----------------------//
function useViaductData(cpackage: string, query: any, revitRef: any) {
  return useQuery<ChartResponse | any>({
    queryKey: [cpackage, viaductLayer, query, status_f],
    queryFn: async () => {
      resetQuerc(query);

      queryDefinitionExpression({
        queryExpression: query.queryExpression(),
        featureLayer: [pierNoLayer],
      });

      visibilityBuildingLayers({
        contractcp: cpackage,
        layers: viaductLayers_all,
      });

      let chartData: any;

      //--- BUILDING SCENE LAYER
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

        //--- MULTIPATCH
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

const Chart = () => {
  const { cpackage } = use(PackageContext);
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;

  //--- Declare React hooks
  const [chartPanelwidth, setChartPanelwidth] = useState<any>();
  const [resetLayerview, setResetLayerview] = useState<boolean>(false);

  const legendRef = useRef<unknown | any | undefined>({});
  const chartRef = useRef<unknown | any | undefined>({});
  const revitRef = useRef<boolean>(true);

  //--- Whether this cpackage uses Revit sublayers vs. a multipatch viaduct layer
  const hasRevit = cp_with_revit.includes(cpackage);

  //--- Common qValues and qFields for QueryExpressionLayers class
  const q1 = new QueryExpressionLayers({
    qFields: [cp_f],
    qValues: [cpackage === "All" ? undefined : cpackage],
  });

  //--- Update cpackage goes with revit or multipatch
  revitRef.current = cp_with_revit.includes(cpackage) ? true : false;

  //--- Chart data
  const { data, isLoading } = useViaductData(cpackage, q1, revitRef);
  const chartData = data?.chartData ?? [];
  const perc_comp = data?.perc_comp ?? 0;

  //--- Sizing derived from measured panel width (0 until first measured, avoiding NaN)
  const fontSize = chartPanelwidth / 20;
  const valueSize = fontSize * 1.55;
  const chartIconSize = chartPanelwidth * 0.07;
  const axisFontSize = chartPanelwidth * 0.036;
  const imageSize = chartPanelwidth * 0.035;

  const zoomFiltersRef = useRef(`${cpackage}`);

  useEffect(() => {
    const currentZoomFilters = `${cpackage}`;

    if (currentZoomFilters !== zoomFiltersRef.current) {
      zoomFiltersRef.current = currentZoomFilters;
      zoomToLayer(pierNoLayer, arcgisScene?.view);
    }

    const root = rootSetter({ chartID: CHART_ID });
    root.setThemes([]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
        ...CHART_MARGINS,
        ...CHART_PADDING,
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

    new ChartStackColumnRender({
      revit: hasRevit,
      layers: hasRevit ? sublayers_all[cpackage] : [viaductLayer],
      root,
      chart,
      data: chartData,
      buildingLayer: hasRevit ? viaductLayers_all[cpackage] : undefined,
      where: q1,
      chartCategoryTypes: viatypes_q,
      chartCategoryTypeField: hasRevit ? type_revit_f : type_layer_f,
      statusTypename: STATUS_TYPE_NAMES,
      statusStatename: STATUS_STATE_NAMES,
      statusArray: viastatus_q,
      statusField: status_f,
      seriesStatusColor: viastatus_q.map((c: any) => c.color),
      strokeColor: CHART_BORDER_LINE_COLOR,
      strokeWidth: CHART_BORDER_LINE_WIDTH,
      view: arcgisScene?.view,
      new_chartIconSize: chartIconSize,
      new_axisFontSize: axisFontSize,
      chartIconPositionX: CHART_ICON_POSITION_X,
      chartPaddingRightIconLabel: CHART_PADDING_RIGHT_ICON_LABEL,
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

  const labelColor = "#9ca3af";
  const valueColor = "#d1d5db";
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
            height={`${imageSize}%`}
            width={`${imageSize}%`}
            style={{
              paddingTop: "20px",
              paddingLeft: "15px",
              opacity: isLoading ? 0 : 1,
            }}
          />
          <dl style={{ alignItems: "center" }}>
            <dt
              style={{
                color: labelColor,
                fontSize: `${fontSize}px`,
                marginRight: "35px",
              }}
            >
              TOTAL PROGRESS
            </dt>
            <dd
              style={{
                color: valueColor,
                fontSize: `${valueSize}px`,
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
          id={CHART_ID}
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
          <div id="filterButton" style={{ marginLeft: "30%", marginTop: "5%" }}>
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
};

export default Chart;
