import "@esri/calcite-components/components/calcite-panel";
import "@esri/calcite-components/components/calcite-list-item";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-action";
import "@esri/calcite-components/components/calcite-action-bar";
import "@arcgis/map-components/components/arcgis-building-explorer";
import { use, useEffect, useState } from "react";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-direct-line-measurement-3d";
import "@arcgis/map-components/components/arcgis-area-measurement-3d";
import "@arcgis/map-components/components/arcgis-time-slider";
import { defineActions } from "../query";
import TimeSlider from "./TimeSlider";
import { sublayers_all, viaductLayer } from "../layers";
import type { ArcgisTimeSlider } from "@arcgis/map-components/components/arcgis-time-slider";
import { cp_field } from "../uniqueValues";
import { MyContext } from "../contexts/MyContext";

function ActionPanel() {
  const { cpackage } = use(MyContext);
  const [activeWidget, setActiveWidget] = useState(null);
  const [nextWidget, setNextWidget] = useState(null);
  const timeSlider = document.querySelector(
    "arcgis-time-slider",
  ) as ArcgisTimeSlider;

  const directLineMeasure = document.querySelector(
    "arcgis-direct-line-measurement-3d",
  );
  const shellPanel: any = document.getElementById("left-shell-panel");

  useEffect(() => {
    if (activeWidget) {
      const actionActiveWidget: any = document.querySelector(
        `[data-panel-id=${activeWidget}]`,
      );
      actionActiveWidget.hidden = true;
      shellPanel.collapsed = true;

      directLineMeasure
        ? directLineMeasure.clear()
        : console.log("Line measure is cleared");

      if (timeSlider) {
        //--- Reset to default state
        timeSlider.timeExtent = null;

        const qe = `${cp_field} = '${cpackage}'`;
        viaductLayer.definitionExpression = qe;
        sublayers_all[cpackage].map((sublayer: any) => {
          sublayer.layer.definitionExpression = qe;
        });
      }
    }

    if (nextWidget !== activeWidget) {
      const actionNextWidget: any = document.querySelector(
        `[data-panel-id=${nextWidget}]`,
      );
      actionNextWidget.hidden = false;
      shellPanel.collapsed = false;

      // Timeslider and handedOver charts do not appear in shell-panel so
      // need to collapse shell-panel manually
      if (nextWidget === "timeslider") {
        shellPanel.collapsed = true;
      }
      //       if (nextWidget === "handedover-charts" || nextWidget === "timeslider") {
      //   shellPanel.collapsed = true;
      // }
    }
  });

  return (
    <>
      <calcite-shell-panel
        slot="panel-start"
        id="left-shell-panel"
        displayMode="dock"
        collapsed
        style={{ "--calcite-shell-panel-background-color": "#2b2b2b" }}
      >
        <calcite-action-bar
          slot="action-bar"
          style={{
            borderStyle: "solid",
            borderRightWidth: 5,
            borderLeftWidth: 5,
            borderBottomWidth: 5,
            borderColor: "#555555",
          }}
        >
          <calcite-action
            data-action-id="layers"
            icon="layers"
            text="layers"
            id="layers"
            //textEnabled={true}
            onClick={(event: any) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></calcite-action>

          <calcite-action
            data-action-id="basemaps"
            icon="basemap"
            text="basemaps"
            id="basemaps"
            onClick={(event: any) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></calcite-action>

          <calcite-action
            data-action-id="directline-measure"
            icon="measure-line"
            text="Line Measurement"
            id="directline-measure"
            onClick={(event: any) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></calcite-action>

          <calcite-action
            data-action-id="timeslider"
            icon="sliders-horizontal"
            text="Time Slider"
            id="timeslider"
            onClick={(event: any) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></calcite-action>

          <calcite-action
            data-action-id="information"
            icon="information"
            text="Information"
            id="information"
            onClick={(event: any) => {
              setNextWidget(event.target.id);
              setActiveWidget(nextWidget === activeWidget ? null : nextWidget);
            }}
          ></calcite-action>
        </calcite-action-bar>

        <calcite-panel heading="Layers" data-panel-id="layers" hidden>
          <arcgis-layer-list
            referenceElement="arcgis-scene"
            selectionMode="multiple"
            visibilityAppearance="checkbox"
            filter-placeholder="Filter layers"
            listItemCreatedFunction={defineActions}
          ></arcgis-layer-list>
        </calcite-panel>

        <calcite-panel heading="Basemaps" data-panel-id="basemaps" hidden>
          <arcgis-basemap-gallery referenceElement="arcgis-scene"></arcgis-basemap-gallery>
        </calcite-panel>

        <calcite-panel
          heading="Direct Line Measure"
          data-panel-id="directline-measure"
          hidden
        >
          <arcgis-direct-line-measurement-3d
            id="directLineMeasurementAnalysisButton"
            referenceElement="arcgis-scene"
            // onarcgisPropertyChange={(event) => console.log(event.target.id)}
          ></arcgis-direct-line-measurement-3d>
        </calcite-panel>

        <calcite-panel
          className="timeslider"
          data-panel-id="timeslider"
          hidden
        ></calcite-panel>

        <calcite-panel heading="Description" data-panel-id="information" hidden>
          {nextWidget === "information" ? (
            <div style={{ paddingLeft: "20px" }}>
              This smart map shows the construction progress on structural
              components of viaduct:
              <ul>
                <li>Bored Pile, </li>
                <li>Pile Cap, </li>
                <li>Pier (Column), </li>
                <li>Pier Head, </li>
                <li>Pre-cast (pier-to-pier span)</li>
                <li>At-Grade</li>
                <li>Noise Barrier</li>
              </ul>
              <div style={{ paddingLeft: "20px" }}>
                <div>The source of data:</div>
                <li>
                  <li>S-01: BIM Revit Files: LOD 350</li>
                  <li>S-02 to S-06: CAD Files</li>
                </li>
              </div>
            </div>
          ) : (
            <div className="informationDiv" hidden></div>
          )}
        </calcite-panel>
      </calcite-shell-panel>

      {nextWidget === "timeslider" && nextWidget !== activeWidget && (
        <TimeSlider />
      )}
    </>
  );
}

export default ActionPanel;
