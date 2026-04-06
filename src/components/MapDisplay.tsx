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
  viaductLayer,
} from "../layers";
import type { ArcgisScene } from "@arcgis/map-components/components/arcgis-scene";
import type { ArcgisSearch } from "@arcgis/map-components/components/arcgis-search";

function MapDisplay() {
  const arcgisScene = document.querySelector("arcgis-scene") as ArcgisScene;
  const arcgisSearch = document.querySelector("arcgis-search") as ArcgisSearch;

  arcgisScene?.viewOnReady(() => {
    arcgisScene?.map?.add(buildingLayer);
    arcgisScene?.map?.add(viaductLayer);
    arcgisScene?.map?.add(alignmentGroupLayer);
    arcgisScene?.map?.add(stationLayer);

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
      <arcgis-compass slot="top-right"></arcgis-compass>
      <arcgis-zoom slot="bottom-right"></arcgis-zoom>
      <arcgis-expand close-on-esc slot="top-right" mode="floating">
        <arcgis-search></arcgis-search>
      </arcgis-expand>
    </arcgis-scene>
  );
}

export default MapDisplay;
