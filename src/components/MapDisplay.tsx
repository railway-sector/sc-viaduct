import "../index.css";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-search";
import {
  alignmentGroupLayer,
  buildingLayer,
  stationLayer,
  droneImageVideoGroupLayer,
  viaductLayer,
  droneLayers,
  sources,
  buildingLayer_s04,
  // buildingLayer_s02,
} from "../layers";
import type { ArcgisScene } from "@arcgis/map-components/components/arcgis-scene";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { use, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import { addLayersToMap, updateMediaInfo } from "../query";
import { image_scales } from "../uniqueValues";
import UndergroundSwitch from "./UndergroundSwitch";
import DroneImage from "./DroneImage";
import DroneVideo from "./DroneVideo";

function MapDisplay() {
  const {
    mediaopen,
    mediatype,
    mediascale,
    updateMediaopen,
    updateMediatype,
    updateMediapaths,
    updateMediascale,
    updateMediatimestamp,
  } = use(MyContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  arcgisScene?.viewOnReady(() => {
    //--- Add Layers
    addLayersToMap(arcgisScene?.map, [
      buildingLayer,
      buildingLayer_s04,
      // buildingLayer_S02,
      viaductLayer,
      alignmentGroupLayer,
      stationLayer,
      droneImageVideoGroupLayer,
    ]);

    //--- Change view environment
    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;
    arcgisScene.hideAttribution = true;

    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.navigationConstraint = { type: "none" };
      arcgisScene.map.ground.opacity = 0.7;
    }

    //--- Search widget
    arcgisSearch.allPlaceholder = "PierNumber, uniqueID";
    arcgisSearch.includeDefaultSourcesDisabled = true;
    arcgisSearch.locationDisabled = true;
    arcgisSearch?.sources.push(...sources);
  });

  //------------------------------------//
  //     Drone Layers configuration     //
  //------------------------------------//
  const [align, setAlign] = useState<string>("Level");

  arcgisScene?.view.on("click", async (event: any) => {
    const response = await arcgisScene?.view.hitTest(event);
    const result: any = response.results[0];
    const layer_title = result?.graphic?.layer?.title;

    if (!layer_title) return;

    if (["Drone Video", "Drone Image"].includes(layer_title)) {
      const attributes = result.graphic.attributes;

      //--- Update boolean: media is opened? [controls display]
      updateMediaopen(!mediaopen);

      //--- Update media type clicked: image or video
      updateMediatype(attributes["Type"]);

      //--- Compile media info clicked
      updateMediaInfo({
        mediaLayer: droneLayers[attributes["Type"]],
        id: attributes["id"],
        srcpath: updateMediapaths,
        timestamp: updateMediatimestamp,
      });
    }
  });

  const handleScaleChange = (event: any) => {
    updateMediascale(event.target.selectedItem.id);
  };

  //--- Helper function to choose image or video Component
  const mediaComponents: Record<string, React.ReactNode> = {
    image: <DroneImage />,
    video: <DroneVideo />,
  };

  return (
    <arcgis-scene
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom={18}
      center="120.9793, 14.623"
    >
      {/* ---------- Media Container ---------- */}
      <div style={{ display: mediaopen === true ? "block" : "none" }}>
        {/* Close Button */}
        <div style={{ display: "flex", margin: "5px" }}>
          <calcite-button
            icon-end="x-circle-f"
            label="Close button"
            appearance="solid"
            onClick={() => {
              (updateMediaopen(false), updateMediapaths(null));
            }}
            scale="s"
          >
            Close
          </calcite-button>

          {/* Alignment Button */}
          <calcite-button
            icon-end={
              align === "Level"
                ? "distribute-height-evenly"
                : "distribute-width-evenly"
            }
            label="Vertically align images"
            name="vertical"
            appearance="solid"
            onClick={() => {
              setAlign((prev) => (prev === "Level" ? "vertical" : "Level"));
            }}
            scale="s"
            style={{ marginLeft: "5px" }}
          >
            {align === "Level" ? "Verical" : "Level"}
          </calcite-button>

          {/* Media Scales: */}
          <calcite-segmented-control
            oncalciteSegmentedControlChange={(event: any) => {
              handleScaleChange(event);
            }}
            scale="s"
            style={{ marginLeft: "5px" }}
          >
            {mediascale &&
              image_scales.map((scale: any, index: any) => {
                return (
                  <calcite-segmented-control-item
                    {...(mediascale === scale ? { checked: true } : {})}
                    key={index}
                    value={scale}
                    id={scale}
                  >
                    x{scale}
                  </calcite-segmented-control-item>
                );
              })}
          </calcite-segmented-control>
        </div>

        {/* Media Container: */}
        <div
          style={{
            margin: "1px",
            zIndex: 1,
            position: "fixed",
            display: align === "vertical" ? "block" : "flex",
          }}
        >
          {mediaComponents[mediatype] ?? null}
        </div>
      </div>

      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
      <arcgis-expand close-on-esc slot="top-right" mode="floating">
        <arcgis-search></arcgis-search>
      </arcgis-expand>

      {/* Underground switch */}
      <UndergroundSwitch />
    </arcgis-scene>
  );
}

export default MapDisplay;
