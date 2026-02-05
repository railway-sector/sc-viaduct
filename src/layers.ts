import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import {
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  MeshSymbol3D,
  FillSymbol3DLayer,
  LabelSymbol3D,
  TextSymbol3DLayer,
} from "@arcgis/core/symbols";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import { viatypes } from "./Query";
import PopupTemplate from "@arcgis/core/PopupTemplate";

/* Standalone table for Dates */
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "b2a118b088a44fa0a7a84acbe0844cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});

/* Chainage Layer  */
const labelChainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: {
      size: 15,
      weight: "bold",
    },
  },
});

const chainageRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: {
      width: 0.2,
      color: "black",
    },
  }),
});

export const chainageLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "Chainage",
  elevationInfo: {
    mode: "relative-to-ground",
  },
  labelingInfo: [labelChainage],
  minScale: 150000,
  maxScale: 0,
  renderer: chainageRenderer,
  // outFields: ['*'],
  popupEnabled: false,
});

// * Pier No layer * //
const pierNoLabelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "white",
        },
        size: 10,
        halo: {
          color: "black",
          size: 1,
        },
        font: {
          family: "Ubuntu Mono",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 40,
      maxWorldLength: 100,
      minWorldLength: 20,
    },
    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "white",
      size: 0.7,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.PierNumber",
    //value: "{TEXTSTRING}"
  },
});

export const pierNoLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/3",
  labelingInfo: [pierNoLabelClass],
  elevationInfo: {
    mode: "on-the-ground", //absolute-height, relative-to-ground
  },
  title: "Pier No",
  // outFields: ['*'],
  popupEnabled: false,
});

// * PROW *//
const prowRenderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});
export const rowLayer = new FeatureLayer({
  url: "https://gis.railway-sector.com/server/rest/services/SC_Alignment/FeatureServer/5",
  layerId: 5,
  title: "PROW",
  renderer: prowRenderer,
  popupEnabled: false,
});

// * Station Layer * //
const stationLayerTextSymbol = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "#d4ff33",
        },
        size: 13,
        halo: {
          color: "black",
          size: 0.5,
        },
        font: {
          family: "Ubuntu Mono",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 100,
      maxWorldLength: 150,
      minWorldLength: 120,
    },
    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "white",
      size: 0.7,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Station, "no data")',
    //value: "{TEXTSTRING}"
  },
});

export const stationLayer = new FeatureLayer({
  portalItem: {
    id: "e09b9af286204939a32df019403ef438",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,
  title: "Station",
  labelingInfo: [stationLayerTextSymbol],
  elevationInfo: {
    mode: "relative-to-ground",
  },
});
stationLayer.listMode = "hide";

/* Launching girder */
const launchingGirderLabelClass = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: {
          color: "red",
        },
        size: 14,
        halo: {
          color: "black",
          size: 1,
        },
        font: {
          family: "Ubuntu Mono",
          weight: "bold",
        },
      }),
    ],
    verticalOffset: {
      screenLength: 45,
      maxWorldLength: 120,
      minWorldLength: 25,
    },
    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: "red",
      size: 1,
      border: {
        color: "grey",
      },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.LAYER",
    //value: "{TEXTSTRING}"
  },
});

export const launchingGirderLayer = new FeatureLayer({
  portalItem: {
    id: "876de8483da9485aac5df737cbef2143",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,
  labelingInfo: [launchingGirderLabelClass],
  elevationInfo: {
    mode: "on-the-ground", //absolute-height, relative-to-ground
  },
  title: "Girder Launcher Location",
  // outFields: ['*'],
  definitionExpression: "LAYER IS NOT NULL",
});

// * Viaduct * //
const colorStatus = [
  [225, 225, 225, 0.1], // To be Constructed (white)
  [211, 211, 211, 0.5], // Under Construction
  [255, 0, 0, 0.8], // Delayed
  [0, 112, 255, 0.8], // Completed
];

const viaduct_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: [
    {
      value: 1,
      label: "To be Constructed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[0],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    {
      value: 4,
      label: "Completed",
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[3],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
  ],
});

export const viaductLayer = new SceneLayer({
  portalItem: {
    id: "1f89733a04b443e2a1e0e5e6dfd493e3",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  elevationInfo: {
    mode: "absolute-height", //absolute-height, relative-to-ground
  },
  title: "Viaduct",
  labelsVisible: false,
  renderer: viaduct_renderer,
  definitionExpression: "CP <> 'S-01'",
  popupTemplate: {
    title: "<p>{PierNumber}</p>",
    lastEditInfoEnabled: false,
    returnGeometry: true,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Type",
            label: "Type",
          },
          {
            fieldName: "CP",
          },
          {
            fieldName: "uniqueID",
          },
        ],
      },
    ],
  },
});

export const viaductLayerStatus4 = new SceneLayer({
  portalItem: {
    id: "1f89733a04b443e2a1e0e5e6dfd493e3",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  definitionExpression: "Status = 4",
});

export const alignmentGroupLayer = new GroupLayer({
  title: "Alignment",
  visible: true,
  visibilityMode: "independent",
  layers: [chainageLayer, pierNoLayer, rowLayer], //stationLayer,
});

// export const viaductGroupLayer = new GroupLayer({
//   title: "Viaduct",
//   visible: true,
//   visibilityMode: "independent",
//   // layers: [launchingGirderLayer, viaductLayer],
//   layers: [viaductLayer],
// });

// Building Scene Layers ------------------------------

const customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    // Extract AsscessDate of clicked pierAccessLayer
    const cps = event.graphic.attributes["CP"];
    const status = event.graphic.attributes["Status"];
    const types = event.graphic.attributes["Types"];
    const planned_date = event.graphic.attributes["t01__Planned_Date"];
    const end_date = event.graphic.attributes["t01__End_Date"];

    return `
    <div style='line-height: 1.7'>
      <ul>
        <li>Contract Package: <span style='color: #ffffff; font-weight: bold'>${cps}</span></li>
        <li>Types: <span style='color: #ffffff; font-weight: bold'>${
          viatypes.find((emp: any) => emp.value === types)?.category
        }</span></li>
        <li>Status: <span style='color: #ffffff; font-weight: bold'>${
          status === 1 ? "Incomplete" : status === 4 ? "Completed" : "Unknown"
        }</span></li>
        <li>Planned Date: <span style='color: #ffffff; font-weight: bold'>${
          planned_date ? planned_date : ""
        }</span></li>
        <li>End Date: <span style='color: #ffffff; font-weight: bold'>${
          end_date ? end_date : ""
        }</span></li>
      </ul>
    </div>
              `;
  },
});

const popupTemplate = new PopupTemplate({
  title: "<div style='color: #eaeaea'>Pier Number: <b>{PierNumber}</b></div>",
  lastEditInfoEnabled: false,
  content: [customContentLot],
});

const renderer_revit = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: [
    {
      value: 1,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[0],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
    {
      value: 4,
      symbol: new MeshSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: colorStatus[3],
              colorMixMode: "replace",
            },
            edges: new SolidEdges3D({
              color: [225, 225, 225, 0.3],
            }),
          }),
        ],
      }),
    },
  ],
});

const rendererNotMonitoring = new SimpleRenderer({
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: {
          color: [255, 255, 155, 0.1],
          colorMixMode: "replace",
        },
        edges: new SolidEdges3D({
          color: [255, 255, 155, 0.3],
        }),
      }),
    ],
  }),
});

//----------------------------------------------------//
//----------------------- S-01 -----------------------//
//----------------------------------------------------//
/* Building Scene Layer for station structures */
export const buildingLayer = new BuildingSceneLayer({
  portalItem: {
    id: "d700fbaf25b04fe8a921fcfa144cb158",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  legendEnabled: false,
  title: "Viaduct (S-01)",
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
        specialtyEquipmentLayer.popupTemplate = popupTemplate;
        specialtyEquipmentLayer.title = "Specialty Equipment (Not Monitored)";
        specialtyEquipmentLayer.renderer = rendererNotMonitoring;
        //excludedLayers
        break;

      case "Bearings":
        bearingsLayer = layer;
        bearingsLayer.popupTemplate = popupTemplate;
        bearingsLayer.title = "Bearing";
        bearingsLayer.renderer = renderer_revit;
        break;

      case "Piers":
        piersLayer = layer;
        piersLayer.popupTemplate = popupTemplate;
        piersLayer.title = "Pier Columns";
        piersLayer.renderer = renderer_revit;
        break;

      case "Decks":
        decksLayer = layer;
        decksLayer.popupTemplate = popupTemplate;
        decksLayer.title = "Decks (Precast)";
        decksLayer.renderer = renderer_revit;
        break;

      case "StructuralFoundation":
        stFoundationLayer = layer;
        stFoundationLayer.popupTemplate = popupTemplate;
        stFoundationLayer.title = "Pile / Pile Caps";
        stFoundationLayer.renderer = renderer_revit;
        break;

      case "StructuralFraming":
        stFramingLayer = layer;
        stFramingLayer.popupTemplate = popupTemplate;
        stFramingLayer.title = "Structural Framing (Not Monitored)";
        stFramingLayer.renderer = rendererNotMonitoring;
        break;

      default:
        layer.visible = true;
    }
  });
});

//----------------------------------------------------//
//----------------------- S-06 -----------------------//
//----------------------------------------------------//
export const buildingLayer_s06 = new BuildingSceneLayer({
  portalItem: {
    id: "1a0404c00e76438796c536de64248cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  legendEnabled: false,
  title: "Viaduct (S-06)",
});

// Discipline: Architectural
export let specialtyEquipmentLayer_s06: null | any;

// Discipline: Structural
export let stFoundationLayer_s06: null | any;

// Discipline: Infrastructure
export let bearingsLayer_s06: null | any;
export let piersLayer_s06: null | any;
export let decksLayer_s06: null | any;

export let exteriorShellLayer_s06: null | any;

buildingLayer_s06.when(() => {
  buildingLayer_s06.allSublayers.forEach((layer: any) => {
    switch (layer.modelName) {
      case "FullModel":
        layer.visible = true;
        break;

      case "Overview":
        exteriorShellLayer_s06 = layer;
        exteriorShellLayer_s06.visible = false;
        exteriorShellLayer_s06.title = "Exterior Shell";
        break;

      case "SpecialtyEquipment":
        specialtyEquipmentLayer_s06 = layer;
        specialtyEquipmentLayer_s06.popupTemplate = popupTemplate;
        specialtyEquipmentLayer_s06.title =
          "Specialty Equipment (Not Monitored)";
        specialtyEquipmentLayer_s06.renderer = rendererNotMonitoring;
        //excludedLayers
        break;

      case "Bearings":
        bearingsLayer_s06 = layer;
        bearingsLayer_s06.popupTemplate = popupTemplate;
        bearingsLayer_s06.title = "Bearing";
        bearingsLayer_s06.renderer = renderer_revit;
        break;

      case "Piers":
        piersLayer_s06 = layer;
        piersLayer_s06.popupTemplate = popupTemplate;
        piersLayer_s06.title = "Pier Columns";
        piersLayer_s06.renderer = renderer_revit;
        break;

      case "Decks":
        decksLayer_s06 = layer;
        decksLayer_s06.popupTemplate = popupTemplate;
        decksLayer_s06.title = "Decks (Precast)";
        decksLayer_s06.renderer = renderer_revit;
        break;

      case "StructuralFoundation":
        stFoundationLayer_s06 = layer;
        stFoundationLayer_s06.popupTemplate = popupTemplate;
        stFoundationLayer_s06.title = "Pile / Pile Caps";
        stFoundationLayer_s06.renderer = renderer_revit;
        break;

      default:
        layer.visible = true;
    }
  });
});
