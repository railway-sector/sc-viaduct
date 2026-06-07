//---------------------------------------------//
export const cp_with_revit = ["S-01"];
// export const cp_with_revit = ["S-01", "S-04"];

//-- When cp_with_revit is updated, ensure to update the followings:
// 1. Change arcgisScene?.map.add
// 2. Change the following in QueryExpression.ts
// export const buildingSceneLayersList = [
//   buildingLayer, // S-01
//   viaductLayer, // S-02
//   viaductLayer, // S-03a
//   viaductLayer, // S-03b
//   viaductLayer, // S-03c
//   viaductLayer, //buildingLayer_s04, // S-04
//   viaductLayer, // S-05
//   viaductLayer, // S-06
// ];

//----------------------------------------------//

export const image_scales = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4];
export const img_size = 280;
export const timestamp_field = "timestamp";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//--- field definitions
export const cp_field = "CP";
export const type_field_revit = "Types";
export const type_field_layer = "Type";
export const status_field = "Status";

export type StatusTypenamesType =
  | "To be Constructed"
  | "Under Construction"
  | "delayed"
  | "Completed";
export type StatusStateType = "comp" | "incomp" | "ongoing" | "delayed";
export type LayerNameType = "utility" | "viaduct" | "others";
export type TypeFieldType = "number" | "string";

// export const construction_status = [
//   "To be Constructed",
//   "Under Construction",
//   "Completed",
// ];

export const contractPackage = [
  "S-01",
  "S-02",
  "S-03a",
  "S-03b",
  "S-03c",
  "S-04",
  "S-05",
  "S-06",
];

//--- Layer types
export const viaductStatusLabel = [
  "To be Constructed",
  "Under Construction",
  "Delayed",
  "Completed",
];

export const viaductStatusColorForChart = [
  "#000000",
  "#f7f7f7ff",
  "#FF0000",
  "#0070ff",
];

export const viaductStatusColorForLayer = [
  [225, 225, 225, 0.1], // To be Constructed (white)
  [211, 211, 211, 0.5], // Under Construction
  [255, 0, 0, 0.8], // Delayed
  [0, 112, 255, 0.8], // Completed
];

//---- Time slider parameter and configurations (Scene layer)
export const timeSliderParameters = [
  "Planned Completion Date",
  "Actual Start Date",
  "Actual Completion Date",
];

export const actualFieldNames = [
  "finish_plan",
  "start_actual",
  "finish_actual",
];

export const timeSliderDatesNames = timeSliderParameters.map(
  (field: any, index: any) => {
    return Object.assign({
      datename: field,
      datefield: actualFieldNames[index],
    });
  },
);

//---- Time slider parameter and configurations (Building scene layer = 'bs')
// export const actualFieldNames_bs = [
//   "finish_plan",
//   "start_actual",
//   "finish_actual",
// ];

// export const timeSliderDatesNames_bs = timeSliderParameters.map(
//   (field: any, index: any) => {
//     return Object.assign({
//       datename: field,
//       datefield: actualFieldNames_bs[index],
//     });
//   },
// );

//--- Chart and chart label color
export const primaryLabelColor = "#d1d5db";
export const valueLabelColor = "#d1d5db";

//---------------------------------------------//
//           Viaduct Multipatch Layer          //
//---------------------------------------------//
export const category_labels = [
  "Bored Pile",
  "Pile Cap",
  "Pier",
  "Pier Head",
  "Precast",
  "At-Grade",
  "Noise Barrier",
  "Others",
];

const category_values = [1, 2, 3, 4, 5, 7, 8, 0];
const category_icons = [
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
];

export const viatypes = category_labels.map((category: any, index: any) => {
  return Object.assign({
    category: category,
    value: category_values[index],
    icon: category_icons[index],
  });
});

//-----------------------------------------//
//             S-01: Sublayer              //
//-----------------------------------------//
export const s01_category_labels = [
  "Bored Pile",
  "Pile Cap",
  "Pier",
  "Pier Head",
  "Precast",
  "Noise Barrier",
  // "Others",
];

export const s01_category_value = [1, 2, 3, 4, 5, 8, 0];
export const sublayers_modelNames = [
  "StructuralFoundation",
  "StructuralFoundation",
  "Piers",
  "Piers",
  "Decks",
  "Piers", // noise barrier
  // "others", // dummy names
];

export const s01_category_icon = [
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
];

//-----------------------------------------//
//             S-04: Sublayer              //
//-----------------------------------------//
export const s04_category_labels = [
  "Bored Pile",
  "Pile Cap",
  "Pier",
  "Pier Head",
  "Precast",
  "Noise Barrier",
  "Others",
];

export const s04_category_value = [1, 2, 3, 4, 5, 8, 0];

export const s04_sublayers_modelNames = [
  "StructuralFoundation",
  "StructuralFoundation",
  "Piers",
  "Piers",
  "Decks",
  "Piers",
  // "others", // dummy names
];

export const s04_category_icon = [
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
];

//--- Viaduct types for multipatch
export function viatypes0(
  category_labels: any,
  valueList: any,
  iconList: any,
  modelNamesList: any,
) {
  return category_labels.map((category: any, index: any) => {
    return Object.assign({
      category: category,
      value: valueList[index],
      icon: iconList[index],
      modelName: modelNamesList[index],
    });
  });
}

//

export const viaStatusLabels = ["incomp", "ongoing", "delayed", "comp"];
export const viaStatusValues = [1, 2, 3, 4];
export const viaStatusArray = viaStatusLabels.map((status: any, index: any) => {
  return Object.assign({
    status: status,
    value: viaStatusValues[index],
  });
});
