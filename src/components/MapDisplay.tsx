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
  drone_image_point_layer,
  drone_video_point_layer,
  droneImageVideoGroupLayer,
  viaductLayer,
  // buildingLayer_s04,
  // buildingLayer_s02,
} from "../layers";
import type { ArcgisScene } from "@arcgis/map-components/components/arcgis-scene";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";
import { use, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import { mediaQuery } from "../Query";
import { image_scales } from "../uniqueValues";
import DroneImageComponent from "./DroneImageComponent";
import DroneVideoComponent from "./DroneVideoComponent";

function MapDisplay() {
  const {
    imageopen,
    mediatype,
    mediaSelectedscale,
    updateImageOpen,
    updateMediatype,
    updateMediasrcpaths,
    updateMediaSelectedscale,
    updateMediatimestamp,
  } = use(MyContext);

  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  arcgisScene?.viewOnReady(() => {
    // arcgisScene?.map?.add(buildingLayer_s04);
    // arcgisScene?.map?.add(buildingLayer_s02);
    arcgisScene?.map?.add(buildingLayer);
    arcgisScene?.map?.add(viaductLayer);
    arcgisScene?.map?.add(alignmentGroupLayer);
    arcgisScene?.map?.add(stationLayer);
    arcgisScene?.map?.add(droneImageVideoGroupLayer);

    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;
    arcgisScene.hideAttribution = true;
    arcgisScene.view.environment.atmosphereEnabled = false;
    arcgisScene.view.environment.starsEnabled = false;
    if (arcgisScene?.map?.ground) {
      arcgisScene.map.ground.navigationConstraint = { type: "none" };
      arcgisScene.map.ground.opacity = 0.7;
    }

    const sources: any = [
      {
        layer: viaductLayer,
        searchFields: ["PierNumber"],
        displayField: "PierNumber",
        exactMatch: false,
        outFields: ["PierNumber"],
        name: "Pier Number",
        placeholder: "example: P-1011",
      },
      {
        layer: viaductLayer,
        searchFields: ["uniqueID"],
        displayField: "uniqueID",
        exactMatch: false,
        outFields: ["uniqueID"],
        name: "uniqueID",
        placeholder: "example: 12345",
      },
    ];

    arcgisSearch.allPlaceholder = "PierNumber, uniqueID";
    arcgisSearch.includeDefaultSourcesDisabled = true;
    arcgisSearch.locationDisabled = true;
    arcgisSearch?.sources.push(...sources);
  });

  // Drone Image configuration:
  const [imageAlign, setImageAlign] = useState<string>("horizontal");

  arcgisScene?.view.on("click", (event: any) => {
    arcgisScene?.view.hitTest(event).then(async (response: any) => {
      const result = response.results[0];

      if (result) {
        const layer_title = result?.graphic?.layer?.title;

        if (layer_title === "Drone Video" || layer_title === "Drone Image") {
          updateImageOpen(imageopen === false ? true : false);
          const attributes = result.graphic.attributes;
          updateMediatype(attributes["Type"]);
          const ID = attributes["id"];

          if (layer_title === "Drone Image") {
            mediaQuery(drone_image_point_layer, ID).then((item) => {
              if (item.length === 1) {
                updateMediasrcpaths([item[0].path, ""]);
                updateMediatimestamp([item[0].timestamp, ""]);
              } else {
                updateMediasrcpaths([item[0].path, item[1].path]);
                updateMediatimestamp([item[0].timestamp, item[1].timestamp]);
              }
            });
          } else if (layer_title === "Drone Video") {
            updateMediasrcpaths([attributes["Path"], attributes["Path"]]);
            mediaQuery(drone_video_point_layer, ID).then((item) => {
              if (item.length === 1) {
                updateMediasrcpaths([item[0].path, ""]);
                updateMediatimestamp([item[0].timestamp, ""]);
              } else {
                updateMediasrcpaths([item[0].path, item[1].path]);
                updateMediatimestamp([item[0].timestamp, item[1].timestamp]);
              }
            });
          }
        }
      } else {
        console.log("Clicked on empty space");
      }
    });
  });

  const handleScaleChange = (event: any) => {
    updateMediaSelectedscale(event.target.selectedItem.id);
  };

  return (
    <arcgis-scene
      // item-id="5ba14f5a7db34710897da0ce2d46d55f"
      basemap="dark-gray-vector"
      ground="world-elevation"
      viewingMode="local"
      zoom={18}
      center="120.9793, 14.623"
      // onarcgisViewReadyChange={(event: any) => {
      //   setSceneView(event.target);
      // }}
    >
      {/* ---------- Media Container ---------- */}
      <div
        style={{
          display: imageopen === true ? "block" : "none",
        }}
      >
        {/* Close Button */}
        <div style={{ display: "flex", margin: "5px" }}>
          {/* Close Button */}
          <calcite-button
            icon-end="x-circle-f"
            label="Close button"
            appearance="solid"
            onClick={() => {
              (updateImageOpen(false), updateMediasrcpaths(null));
            }}
            scale="s"
          >
            Close
          </calcite-button>

          {/* Alignment Button */}
          <calcite-button
            icon-end={
              imageAlign === "horizontal"
                ? "distribute-height-evenly"
                : "distribute-width-evenly"
            }
            label="Vertically align images"
            name="vertical"
            appearance="solid"
            onClick={() => {
              setImageAlign(
                imageAlign === "horizontal" ? "vertical" : "horizontal",
              );
            }}
            scale="s"
            style={{ marginLeft: "5px" }}
          >
            {imageAlign === "horizontal" ? "Verical" : "Horizontal"}
          </calcite-button>

          {/* Image Scales: */}
          <calcite-segmented-control
            oncalciteSegmentedControlChange={(event: any) => {
              handleScaleChange(event);
            }}
            scale="s"
            style={{ marginLeft: "5px" }}
          >
            {mediaSelectedscale &&
              image_scales.map((scale: any, index: any) => {
                return (
                  <calcite-segmented-control-item
                    {...(mediaSelectedscale === scale ? { checked: true } : {})}
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

        {/* Image Container: */}
        <div
          style={{
            margin: "1px",
            zIndex: 1,
            position: "fixed",
            display: imageAlign === "vertical" ? "block" : "flex",
          }}
        >
          {mediatype === "image" ? (
            <DroneImageComponent />
          ) : mediatype === "video" ? (
            <DroneVideoComponent />
          ) : null}
        </div>
      </div>

      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
      <arcgis-expand close-on-esc slot="top-right" mode="floating">
        <arcgis-search></arcgis-search>
      </arcgis-expand>
    </arcgis-scene>
  );
}

export default MapDisplay;
