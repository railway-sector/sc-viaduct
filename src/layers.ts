import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import {
  chainage_renderer,
  cp_with_revit,
  label_chainage,
  label_image,
  label_stationp,
  label_video,
  pier_access_label,
  portalItems,
  prow_renderer,
  via_popup,
  via_renderer,
  via_revit_nomonitor_renderer,
  via_revit_renderer,
} from "./uniqueValues";

//---------------------------------------------//
//              Media Layers                   //
//---------------------------------------------//
//--- DRONE VIDEO LAYER ---//
export const drone_video_point_layer = new FeatureLayer({
  portalItem: portalItems("ef71df6d19294328a5b756c4806c9c67"),
  layerId: 2,
  definitionExpression: "Query = 'chainage' OR Query = 'pier'",
  title: "Drone Video",
  outFields: ["*"],
  labelingInfo: [label_video],
  popupEnabled: false,
  elevationInfo: { mode: "relative-to-scene" },
});

//--- DRONE IMAGE LAYER ---//
export const drone_image_point_layer = new FeatureLayer({
  portalItem: portalItems("ef71df6d19294328a5b756c4806c9c67"),
  layerId: 1,
  elevationInfo: { mode: "relative-to-scene" },
  definitionExpression: "Query = 'chainage' OR Query = 'pier'",
  title: "Drone Image",
  outFields: ["*"],
  labelingInfo: [label_image],
  popupEnabled: false,
});

//--- COMPILE MEDIA LAYERS
export const droneLayers: any = {
  image: drone_image_point_layer,
  video: drone_video_point_layer,
};

export const droneImageVideoGroupLayer = new GroupLayer({
  title: "Drone Image & Video",
  visible: true,
  visibilityMode: "independent",
  layers: [drone_video_point_layer, drone_image_point_layer],
});

//---------------------------------------------//
//          Alignment Layers                   //
//---------------------------------------------//
//--- CHAINAGE LAYER ---//
export const chainageLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 2,
  title: "Chainage",
  elevationInfo: { mode: "relative-to-ground" },
  labelingInfo: [label_chainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainage_renderer,
  popupEnabled: false,
});

//--- PIER NUMBER POINT LAYER ---//
export const pierNoLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/3",
  labelingInfo: [pier_access_label],
  elevationInfo: { mode: "on-the-ground" },
  title: "Pier No",
  popupEnabled: false,
});

//--- PROW LAYER ---//
export const rowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  layerId: 5,
  title: "PROW",
  renderer: prow_renderer,
  popupEnabled: false,
});

//--- STATION POINT LAYER ---//
export const stationLayer = new FeatureLayer({
  portalItem: portalItems("e09b9af286204939a32df019403ef438"),
  layerId: 6,
  title: "Station",
  labelingInfo: [label_stationp],
  elevationInfo: { mode: "relative-to-ground" },
});
stationLayer.listMode = "hide";

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [chainageLayer, pierNoLayer, rowLayer], //stationLayer,
});

//---------------------------------------------//
//            Viaducgt Layers                  //
//---------------------------------------------//
//--- VIADUCT MULTIPATCH LAYER ---//
export const viaductLayer = new SceneLayer({
  portalItem: portalItems("691f64c4647f439eabc9b18ebd56ce73"),
  elevationInfo: { mode: "absolute-height" },
  title: "Viaduct",
  labelsVisible: false,
  renderer: via_renderer,
  definitionExpression: `CP NOT IN ('${cp_with_revit.join("', '")}')`,
  popupTemplate: via_popup,
});

//--- VIADUCT BUILDING SCENE LAYERS ---//
//------------ S-01 -----------------//
export const buildingLayer = new BuildingSceneLayer({
  portalItem: portalItems("f3f8c93fef8f447c97aae0f5ffcbb7a7"),
  legendEnabled: false,
  title: "S01 Viaduct (LOD: 350)",
});

// Discipline: Architectural
export let specialtyEquipmentLayer: null | any;

// Discipline: Structural
export let stFramingLayer: null | any;
export let stFoundationLayer: null | any;

// Discipline: Infrastructure
export let bearingsLayer: null | any;
export let piersLayer: null | any;
export let decksLayer: null | any;

export let exteriorShellLayer: null | any;

//--- Ensure that s01Sublayers only collect sublayers to be monitored
export let s01Sublayers: null | any = [];
export let s01_sublayers_chart: null | any = [];

buildingLayer.when(() => {
  buildingLayer.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer = layer;
        exteriorShellLayer.visible = false;
        exteriorShellLayer.title = "Exterior Shell";
        break;

      case "SpecialtyEquipment":
        specialtyEquipmentLayer = layer;
        specialtyEquipmentLayer.popupTemplate = via_popup;
        specialtyEquipmentLayer.title = "Specialty Equipment (Not Monitored)";
        specialtyEquipmentLayer.renderer = via_revit_nomonitor_renderer;
        //excludedLayers
        break;

      case "Bearings":
        bearingsLayer = layer;
        bearingsLayer.popupTemplate = via_popup;
        bearingsLayer.title = "Bearings";
        bearingsLayer.renderer = via_revit_renderer;
        break;

      case "Piers":
        piersLayer = layer;
        piersLayer.popupTemplate = via_popup;
        piersLayer.title = "Pier Columns / Pier Head";
        piersLayer.renderer = via_revit_renderer;
        s01Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      case "Decks":
        decksLayer = layer;
        decksLayer.popupTemplate = via_popup;
        decksLayer.title = "Decks (Precast)";
        decksLayer.renderer = via_revit_renderer;
        s01Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = via_popup;
        stFoundationLayer.title = "Pile / Pile Caps";
        stFoundationLayer.renderer = via_revit_renderer;
        s01Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = via_popup;
        stFramingLayer.title = "Structural Framing";
        stFramingLayer.renderer = via_revit_nomonitor_renderer;
        s01Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      default:
        layer.visible = true;
    }
  });
});

//------------ S-02 -----------------//
/* Building Scene Layer for station structures */
// export const buildingLayer_s02 = new BuildingSceneLayer({
//   portalItem: {
//     id: "8cff7bb59aec419dae4a1ffd7b2b9b8d",
//     portal: {
//       url: "https://gis.railway-sector.com/portal",
//     },
//   },
//   legendEnabled: false,
//   title: "S02 Viaduct (LOD: 350)",
// });

// // Discipline: Structural
// export let stFoundationLayer_s02: null | any;

// // Discipline: Infrastructure
// export let abutmentLayer_s02: null | any;
// export let bearingsLayer_s02: null | any;
// export let piersLayer_s02: null | any;
// export let decksLayer_s02: null | any;

// export let exteriorShellLayer_s02: null | any;
// export let s02Sublayers: null | any = [];

// buildingLayer_s02.when(() => {
//   buildingLayer_s02.allSublayers.forEach((layer: any) => {
//     switch (layer.modelName) {
//       case "FullModel":
//         layer.visible = true;
//         break;

//       case "Overview":
//         exteriorShellLayer_s02 = layer;
//         exteriorShellLayer_s02.visible = false;
//         exteriorShellLayer_s02.title = "Exterior Shell";
//         break;

//       case "Abutments":
//         abutmentLayer_s02 = layer;
//         abutmentLayer_s02.popupTemplate = popupTemplate;
//         abutmentLayer_s02.title = "Abutments (Not Monitored)";
//         abutmentLayer_s02.renderer = rendererNotMonitoring;
//         s02Sublayers.push({
//           name: layer.modelName,
//           layer: layer,
//         });
//         break;

//       case "Bearings":
//         bearingsLayer_s02 = layer;
//         bearingsLayer_s02.popupTemplate = popupTemplate;
//         bearingsLayer_s02.title = "Bearings (Not Monitored)";
//         bearingsLayer_s02.renderer = renderer_revit;
//         break;

//       case "Piers":
//         piersLayer_s02 = layer;
//         piersLayer_s02.popupTemplate = popupTemplate;
//         piersLayer_s02.title = "Pier Columns / Pier Head";
//         piersLayer_s02.renderer = renderer_revit;
//         s02Sublayers.push({
//           name: layer.modelName,
//           layer: layer,
//         });
//         break;

//       case "Decks":
//         decksLayer_s02 = layer;
//         decksLayer_s02.popupTemplate = popupTemplate;
//         decksLayer_s02.title = "Decks (Precast)";
//         decksLayer_s02.renderer = renderer_revit;
//         s02Sublayers.push({
//           name: layer.modelName,
//           layer: layer,
//         });
//         break;

//       case "StructuralFoundation":
//         stFoundationLayer_s02 = layer;
//         stFoundationLayer_s02.popupTemplate = popupTemplate;
//         stFoundationLayer_s02.title = "Pile / Pile Caps";
//         stFoundationLayer_s02.renderer = renderer_revit;
//         s02Sublayers.push({
//           name: layer.modelName,
//           layer: layer,
//         });
//         break;

//       default:
//         layer.visible = true;
//     }
//   });
// });

//------------ S-04 -----------------//
/* Building Scene Layer for station structures */
export const buildingLayer_s04 = new BuildingSceneLayer({
  portalItem: {
    id: "a95ae4299b464611987039d0c806744c",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  legendEnabled: false,
  title: "S04 Viaduct (LOD: 350)",
});

export let genericLayer_s04: null | any;
export let stFoundationLayer_s04: null | any;

// Discipline: Infrastructure
export let abutmentLayer_s04: null | any;
export let bearingsLayer_s04: null | any;
export let piersLayer_s04: null | any;
export let decksLayer_s04: null | any;

export let exteriorShellLayer_s04: null | any;
export let s04Sublayers: null | any = [];

buildingLayer_s04.when(() => {
  buildingLayer_s04.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer_s04 = layer;
        exteriorShellLayer_s04.visible = false;
        exteriorShellLayer_s04.title = "Exterior Shell";
        break;

      case "GenericModel":
        genericLayer_s04 = layer;
        genericLayer_s04.visible = false;
        genericLayer_s04.title = "Generic Model (Not Monitored)";
        genericLayer_s04.renderer = via_revit_nomonitor_renderer;
        genericLayer_s04.visible = false;
        break;

      case "Abutments":
        abutmentLayer_s04 = layer;
        abutmentLayer_s04.popupTemplate = via_popup;
        abutmentLayer_s04.title = "Abutments (Not Monitored)";
        abutmentLayer_s04.renderer = via_revit_nomonitor_renderer;
        abutmentLayer_s04.visible = false;
        s04Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      case "Bearings":
        bearingsLayer_s04 = layer;
        bearingsLayer_s04.popupTemplate = via_popup;
        bearingsLayer_s04.title = "Bearings (Not Monitored)";
        bearingsLayer_s04.renderer = via_revit_renderer;
        bearingsLayer_s04.visible = false;
        break;

      case "Piers":
        piersLayer_s04 = layer;
        piersLayer_s04.popupTemplate = via_popup;
        piersLayer_s04.title = "Pier Columns / Pier Head";
        piersLayer_s04.renderer = via_revit_renderer;
        s04Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      case "Decks":
        decksLayer_s04 = layer;
        decksLayer_s04.popupTemplate = via_popup;
        decksLayer_s04.title = "Decks (Precast)";
        decksLayer_s04.renderer = via_revit_renderer;
        s04Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      case "StructuralFoundation":
        stFoundationLayer_s04 = layer;
        stFoundationLayer_s04.popupTemplate = via_popup;
        stFoundationLayer_s04.title = "Pile / Pile Caps";
        stFoundationLayer_s04.renderer = via_revit_renderer;
        s04Sublayers.push({ name: layer.modelName, layer: layer });
        break;

      default:
        layer.visible = true;
    }
  });
});

//------------ S-06 -----------------//
// export const buildingLayer_s06 = new BuildingSceneLayer({
//   portalItem: {
//     id: "1a0404c00e76438796c536de64248cb2",
//     portal: {
//       url: "https://gis.railway-sector.com/portal",
//     },
//   },
//   legendEnabled: false,
//   title: "Viaduct (S-06)",
// });

// // Discipline: Architectural
// export let specialtyEquipmentLayer_s06: null | any;

// // Discipline: Structural
// export let stFoundationLayer_s06: null | any;

// // Discipline: Infrastructure
// export let bearingsLayer_s06: null | any;
// export let piersLayer_s06: null | any;
// export let decksLayer_s06: null | any;

// export let exteriorShellLayer_s06: null | any;

// buildingLayer_s06.when(() => {
//   buildingLayer_s06.allSublayers.forEach((layer: any) => {
//     switch (layer.modelName) {
//       case "FullModel":
//         layer.visible = true;
//         break;

//       case "Overview":
//         exteriorShellLayer_s06 = layer;
//         exteriorShellLayer_s06.visible = false;
//         exteriorShellLayer_s06.title = "Exterior Shell";
//         break;

//       case "SpecialtyEquipment":
//         specialtyEquipmentLayer_s06 = layer;
//         specialtyEquipmentLayer_s06.popupTemplate = popupTemplate;
//         specialtyEquipmentLayer_s06.title =
//           "Specialty Equipment (Not Monitored)";
//         specialtyEquipmentLayer_s06.renderer = rendererNotMonitoring;
//         //excludedLayers
//         break;

//       case "Bearings":
//         bearingsLayer_s06 = layer;
//         bearingsLayer_s06.popupTemplate = popupTemplate;
//         bearingsLayer_s06.title = "Bearing";
//         bearingsLayer_s06.renderer = renderer_revit;
//         break;

//       case "Piers":
//         piersLayer_s06 = layer;
//         piersLayer_s06.popupTemplate = popupTemplate;
//         piersLayer_s06.title = "Pier Columns";
//         piersLayer_s06.renderer = renderer_revit;
//         break;

//       case "Decks":
//         decksLayer_s06 = layer;
//         decksLayer_s06.popupTemplate = popupTemplate;
//         decksLayer_s06.title = "Decks (Precast)";
//         decksLayer_s06.renderer = renderer_revit;
//         break;

//       case "StructuralFoundation":
//         stFoundationLayer_s06 = layer;
//         stFoundationLayer_s06.popupTemplate = popupTemplate;
//         stFoundationLayer_s06.title = "Pile / Pile Caps";
//         stFoundationLayer_s06.renderer = renderer_revit;
//         break;

//       default:
//         layer.visible = true;
//     }
//   });
// });

//--- COMPILE ALL SUBLAYERS
export const sublayers_all: any = {
  "S-01": s01Sublayers,
  "S-02": "",
  "S-03a": "",
  "S-03b": "",
  "S-03c": "",
  "S-04": s04Sublayers,
  "S-05": "",
  "S-06": "",
};

export const viaductLayers_all: any = {
  "S-01": buildingLayer,
  "S-02": viaductLayer,
  "S-03a": viaductLayer,
  "S-03b": viaductLayer,
  "S-03c": viaductLayer,
  "S-04": viaductLayer,
  "S-05": viaductLayer,
  "S-06": viaductLayer,
};

//---------------------------------------------//
//            Other layers                     //
//---------------------------------------------//
export const dateTable = new FeatureLayer({
  portalItem: portalItems("b2a118b088a44fa0a7a84acbe0844cb2"),
});

//---------------------------------------------//
//            Other Parameters                 //
//---------------------------------------------//
export const sources: any = [
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
