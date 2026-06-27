//---------------------------------------------//
export const cp_with_revit = ["S-01"];
// export const cp_with_revit = ["S-01", "S-04"];

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
//                 Viaduct types               //
//---------------------------------------------//
export const via_labels = [
  "Bored Pile",
  "Pile Cap",
  "Pier",
  "Pier Head",
  "Precast",
  "Cantillever",
  "At-Grade",
  "Noise Barrier",
  "Bridge",
  "Others",
];

export const via_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const via_icons = [
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
];

export const viatypes_neo = via_labels.map((category: any, index: any) => {
  return Object.assign({
    category: category,
    value: via_values[index],
    icon: via_icons[index],
  });
});

export const viaStatusLabels = ["incomp", "ongoing", "delayed", "comp"];
export const viaStatusValues = [1, 2, 3, 4];
export const viaStatusArray = viaStatusLabels.map((status: any, index: any) => {
  return Object.assign({
    status: status,
    value: viaStatusValues[index],
  });
});
