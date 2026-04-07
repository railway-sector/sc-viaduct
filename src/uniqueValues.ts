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

export const timeSliderParameters = [
  "Planned Start Date",
  "Planned Completion Date",
  "Actual Completion Date",
];

// Chart and chart label color
export const primaryLabelColor = "#d1d5db";
export const valueLabelColor = "#d1d5db";

//--- Viaduct types
const viaduct_category_label = [
  "Bored Pile",
  "Pile Cap",
  "Pier",
  "Pier Head",
  "Precast",
  "At-Grade",
  "Noise Barrier",
  "Others",
];

const viaduct_category_value = [1, 2, 3, 4, 5, 7, 8, 0];
const viaduct_category_icon = [
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
  "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
];
// Generate chart data
export const viatypes = viaduct_category_label.map(
  (category: any, index: any) => {
    return Object.assign({
      category: category,
      value: viaduct_category_value[index],
      icon: viaduct_category_icon[index],
    });
  },
);

//---- Building sublayer
export const sublayers = [
  "StructuralFoundation",
  "StructuralFoundation",
  "Piers",
  "Piers",
  "Decks",
  "Piers",
];

export const sublayerNames = [
  {
    modelName: "StructuralFoundation",
    category: viatypes[0].category, // pile
  },
  {
    modelName: "StructuralFoundation",
    category: viatypes[1].category, // pile cap
  },
  {
    modelName: "Piers",
    category: viatypes[2].category, // pier
  },
  {
    modelName: "Piers",
    category: viatypes[3].category, // pier head
  },
  {
    modelName: "Decks",
    category: viatypes[4].category, // precast
  },
  {
    modelName: "Piers",
    category: viatypes[6].category, // noise barrier
  },
  // {
  //   modelName: "Piers",
  //   category: viatypes[6].category, // others
  // },
];
