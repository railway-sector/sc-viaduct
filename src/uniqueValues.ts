import LabelClass from "@arcgis/core/layers/support/LabelClass";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D.js";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer.js";
import LabelSymbol3D from "@arcgis/core/symbols/LabelSymbol3D";
import TextSymbol3DLayer from "@arcgis/core/symbols/TextSymbol3DLayer";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { toAsofdate } from "./query";

//---------------------------------------------//
//         Contract Package(s) using Revit     //
//---------------------------------------------//
//--- This Smart Map has a hybrid by using multipatch &
//--- building scene layers.
//--- Ensure to define which CPs use building scene layers below:

export const cp_with_revit = ["S-01"];

//-- When cp_with_revit is updated, ensure to update the followings:
// 1. Change arcgisScene?.map.add
// 2. Change the following in layers.ts
// export const sublayers_all: any = {
//   "S-01": s01Sublayers,
//   "S-02": "",
//   "S-03a": "",
//   "S-03b": "",
//   "S-03c": "",
//   "S-04": s04Sublayers,
//   "S-05": "",
//   "S-06": "",
// };

//--- used to control visibility of layers when cp is selected.
// export const viaductLayers_all: any = {
//   "S-01": buildingLayer,
//   "S-02": viaductLayer,
//   "S-03a": viaductLayer,
//   "S-03b": viaductLayer,
//   "S-03c": viaductLayer,
//   "S-04": viaductLayer,
//   "S-05": viaductLayer,
//   "S-06": viaductLayer,
// };
//----------------------------------------------//

//----------------------------------------------//
//              portalItem                      //
//----------------------------------------------//
const portalItem_url = {
  url: "https://gis.railway-sector.com/portal",
};

export const portalItems = (id: any) => {
  return { id: id, portal: portalItem_url };
};

//----------------------------------------------//
//           Chart Parameters                   //
//----------------------------------------------//
export const primaryLabelColor = "#d1d5db";
export const valueLabelColor = "#d1d5db";

//---------------------------------------------//
//         Media Layer Parameter               //
//---------------------------------------------//
export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

//---------------------------------------------//
//         Time-Slider Parameter               //
//---------------------------------------------//
export const ts_field_q: any = [
  { datename: "Planned Completion Date", datefield: "finish_plan" },
  { datename: "Actual Start Date", datefield: "start_actual" },
  { datename: "Actual Completion Date", datefield: "finish_actual" },
];

//---------------------------------------------//
//                 Layer Fields                //
//---------------------------------------------//
export const cp_f = "CP";
export const type_revit_f = "Types";
export const type_layer_f = "Type";
export const status_f = "Status";

export const cpackages = [
  "S-01",
  "S-02",
  "S-03a",
  "S-03b",
  "S-03c",
  "S-04",
  "S-05",
  "S-06",
];

//---------------------------------------------//
//                 Viaduct types               //
//---------------------------------------------//
//--- VIADUCT TYPES
export const viatypes_q = [
  { value: 1, category: "Bored Pile" },
  { value: 2, category: "Pile Cap" },
  { value: 3, category: "Pier" },
  { value: 4, category: "Pier Head" },
  { value: 5, category: "Precast" },
  // { value: 6, category: "Cantillever" },
  { value: 7, category: "At-Grade" },
  { value: 8, category: "Noise Barrier" },
  { value: 9, category: "Bridge" },
  { value: 0, category: "Others" },
];

//--- VIADUCT STATUS
export const viastatus_q: any = [
  {
    value: 1,
    status: "incomp",
    label: "To be Constructed",
    color: "#000000",
    rgb: [225, 225, 225, 0.1],
  },
  {
    value: 2,
    status: "ongoing",
    label: "Under Construction",
    color: "#f7f7f7ff",
    rgb: [211, 211, 211, 0.5],
  },
  {
    value: 3,
    status: "delayed",
    label: "Delayed",
    color: "#FF0000",
    rgb: [255, 0, 0, 0.8],
  },
  {
    value: 4,
    status: "comp",
    label: "Completed",
    color: "#0070ff",
    rgb: [0, 112, 255, 0.8],
  },
];

//---------------------------------------------//
//              Layer Parameters               //
//---------------------------------------------//
//--- DRONE IMAGE & VIDEO LAYERS ---//
interface LabelSymbolMedia {
  srcL: number;
  maxWL: number;
  minWL: number;
}

function labelSymbol3DMedia({ srcL, maxWL, minWL }: LabelSymbolMedia) {
  const symbol = new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: [255, 255, 0] },
        size: 15,
        halo: { color: "black", size: 0.5 },
      }),
    ],
    verticalOffset: {
      screenLength: srcL,
      maxWorldLength: maxWL,
      minWorldLength: minWL,
    },

    callout: {
      type: "line", // autocasts as new LineCallout3D()
      color: [128, 128, 128, 0.5],
      size: 0.2,
      border: { color: "grey" },
    },
  });
  return symbol;
}

//--- DRONE IMAGE LAYER ---//
export const label_image = new LabelClass({
  symbol: labelSymbol3DMedia({ srcL: 40, maxWL: 30, minWL: 20 }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: "$feature.Type",
  },
});

//--- DRONE VIDEO LAYER ---//
export const label_video = new LabelClass({
  symbol: labelSymbol3DMedia({ srcL: 20, maxWL: 10, minWL: 10 }),
  labelPlacement: "above-center",
  labelExpressionInfo: { expression: "$feature.Type" },
});

//--- CHAINAGE LAYER ---//
export const label_chainage = new LabelClass({
  labelExpressionInfo: { expression: "$feature.KmSpot" },
  symbol: {
    type: "text",
    color: [85, 255, 0],
    haloColor: "black",
    haloSize: 0.5,
    font: { size: 15, weight: "bold" },
  },
});

export const chainage_renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    size: 5,
    color: [255, 255, 255, 0.9],
    outline: { width: 0.2, color: "black" },
  }),
});

//--- PIER NUMBER POINT LAYER ---//
export const pier_access_label = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: valueLabelColor },
        size: 10,
        halo: { color: "black", size: 1 },
        font: { family: "Ubuntu Mono" },
      }),
    ],
    verticalOffset: {
      screenLength: 40,
      maxWorldLength: 100,
      minWorldLength: 40,
    },
    callout: {
      type: "line",
      size: 0.7,
      color: "white",
      border: { color: "grey" },
    },
  }),
  labelExpressionInfo: { expression: "$feature.PierNumber" },
  labelPlacement: "above-center",
});

//--- PROW LAYER ---//
export const prow_renderer = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: "#ff0000",
    width: "2px",
  }),
});

//--- STATION POINT LAYER ---//
export const label_stationp = new LabelClass({
  symbol: new LabelSymbol3D({
    symbolLayers: [
      new TextSymbol3DLayer({
        material: { color: "#d4ff33" },
        size: 13,
        halo: { color: "black", size: 0.5 },
        font: { family: "Ubuntu Mono" },
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
      border: { color: "grey" },
    },
  }),
  labelPlacement: "above-center",
  labelExpressionInfo: {
    expression: 'DefaultValue($feature.Station, "no data")',
  },
});

//--- VIADUCT LAYERS ---//
const via_uniqueV = [1, 2, 4].map((v: any) => {
  return {
    value: v,
    label: viastatus_q.find((f: any) => f.value === v)?.label,
    symbol: new MeshSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          material: {
            color: viastatus_q.find((f: any) => f.value === v)?.rgb,
            colorMixMode: "replace",
          },
          edges: new SolidEdges3D({ color: [225, 225, 225, 0.3] }),
        }),
      ],
    }),
  };
});

export const via_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: via_uniqueV,
});

//--- VIADUCT MULTIPATCH LAYER ---//

//--- VIADUCT BUILDING SCENE LAYERS ---//
const highlight = (value: unknown) =>
  `<span style="color: #eaeaea; font-weight: bold">${value}</span>`;

const customContentLot = new CustomContent({
  outFields: ["*"],
  creator: (event: any) => {
    const attrs = event.graphic.attributes;
    const cps = attrs[cp_f];
    const status = attrs[status_f];
    const type = attrs["Types"] ?? attrs["Type"];

    //-- Dates
    const start_date = toAsofdate(new Date(attrs["start_actual"]));
    const planned_date = toAsofdate(new Date(attrs["finish_plan"]));
    const end_date = toAsofdate(new Date(attrs["finish_actual"]));
    const typeV = viatypes_q.find((f: any) => f.value === type)?.category;
    const statusL = viastatus_q.filter((f: any) => f.value === status)[0]
      ?.label;

    return `
    <div style='line-height: 1.7'>
      <ul><li>Contract Package: ${highlight(cps)}</li>
      <li>Types: ${highlight(typeV)}</li>
      <li>Status: ${highlight(statusL ?? "")}</li>
      <li>Start Date: ${highlight(start_date ?? "")}</li>
      <li>Planned Date: ${highlight(planned_date ?? "")}</li>
      <li>End Date: ${highlight(end_date ?? "")}</li>
      </ul>
    </div>
              `;
  },
});

export const via_popup = new PopupTemplate({
  title: "<div style='color: #eaeaea'>Pier Number: <b>{PierNumber}</b></div>",
  lastEditInfoEnabled: false,
  content: [customContentLot],
});

export const via_revit_renderer = new UniqueValueRenderer({
  field: "Status",
  uniqueValueInfos: via_uniqueV,
});

export const via_revit_nomonitor_renderer = new SimpleRenderer({
  symbol: new MeshSymbol3D({
    symbolLayers: [
      new FillSymbol3DLayer({
        material: { color: [255, 255, 155, 0.1], colorMixMode: "replace" },
        edges: new SolidEdges3D({ color: [255, 255, 155, 0.3] }),
      }),
    ],
  }),
});

//---------------------------------//
//           Layer List            //
//---------------------------------//
const HIDDEN_TITLES = new Set([
  "Chainage",
  "Viaduct",
  "S04 Viaduct (LOD: 350)",
  "Exterior Shell",
  "Bearings",
  "Specialty Equipment (Not Monitored)",
  "Bearings (Not Monitored)",
  "Abutments (Not Monitored)",
]);

export function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = { content: "legend", open: true };
  }

  item.visible = !HIDDEN_TITLES.has(item.title);
}
