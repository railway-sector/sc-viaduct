/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  bearingsLayer,
  buildingLayer,
  dateTable,
  decksLayer,
  pierNoLayer,
  piersLayer,
  specialtyEquipmentLayer,
  stFoundationLayer,
  stFramingLayer,
  viaductLayer,
  viaductLayerStatus4,
} from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";

export const construction_status = [
  "To be Constructed",
  "Under Construction",
  "Completed",
];

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

// Updat date
export async function dateUpdate() {
  const monthList = [
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

  const query = dateTable.createQuery();
  query.where = "project = 'SC'" + " AND " + "category = 'Viaduct'";

  return dateTable.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const dates = stats.map((result: any) => {
      const date = new Date(result.attributes.date);
      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return final;
    });
    return dates;
  });
}

// Generate chart data
export const viatypes = [
  {
    category: "Bored Pile",
    value: 1,
  },
  {
    category: "Pile Cap",
    value: 2,
  },
  {
    category: "Pier",
    value: 3,
  },
  {
    category: "Pier Head",
    value: 4,
  },
  {
    category: "Precast",
    value: 5,
  },
  {
    category: "At-Grade",
    value: 7,
  },
  {
    category: "Noise Barrier",
    value: 8,
  },
  {
    category: "Others",
    value: 0,
  },
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

export const layerVisibleTrue = () => {
  decksLayer.definitionExpression = "1=1";
  bearingsLayer.definitionExpression = "1=1";
  piersLayer.definitionExpression = "1=1";
  stFoundationLayer.definitionExpression = "1=1";
  stFoundationLayer.visible = true;
  bearingsLayer.visible = true;
  piersLayer.visible = true;
  decksLayer.visible = true;
  stFramingLayer.visible = false;
  specialtyEquipmentLayer.visible = false;
  buildingLayer.visible = true;
};

export async function ChartDataRevit(contractp: any) {
  const expression = "CP = '" + contractp + "'";

  const total_boredpile_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_boredpile_incomp",
    statisticType: "sum",
  });

  const total_boredpile_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 1 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_boredpile_comp",
    statisticType: "sum",
  });

  const total_pilecap_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pilecap_incomp",
    statisticType: "sum",
  });

  const total_pilecap_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 2 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pilecap_comp",
    statisticType: "sum",
  });

  const total_pier_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pier_incomp",
    statisticType: "sum",
  });

  const total_pier_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 3 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pier_comp",
    statisticType: "sum",
  });

  const total_pierhead_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierhead_incomp",
    statisticType: "sum",
  });

  const total_pierhead_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 4 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierhead_comp",
    statisticType: "sum",
  });

  const total_decks_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 5 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_decks_incomp",
    statisticType: "sum",
  });

  const total_decks_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 5 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_decks_comp",
    statisticType: "sum",
  });

  // const total_atgrade_incomp = new StatisticDefinition({
  //   onStatisticField: "CASE WHEN (Types = 7 and Status = 1) THEN 1 ELSE 0 END",
  //   outStatisticFieldName: "total_atgrade_incomp",
  //   statisticType: "sum",
  // });

  // const total_atgrade_comp = new StatisticDefinition({
  //   onStatisticField: "CASE WHEN (Types = 7 and Status = 4) THEN 1 ELSE 0 END",
  //   outStatisticFieldName: "total_atgrade_comp",
  //   statisticType: "sum",
  // });

  const total_pierwalls_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 8 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierwalls_incomp",
    statisticType: "sum",
  });

  const total_pierwalls_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 8 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierwalls_comp",
    statisticType: "sum",
  });

  const total_others_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 0 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_others_incomp",
    statisticType: "sum",
  });

  const total_others_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Types = 0 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_others_comp",
    statisticType: "sum",
  });

  // Bored Pile
  const query_pile = new Query();
  query_pile.outStatistics = [
    total_boredpile_incomp,
    total_boredpile_comp,
    total_others_incomp,
    total_others_comp,
  ];

  contractp && (query_pile.where = expression);
  const piles = stFoundationLayer
    ?.queryFeatures(query_pile)
    .then((response: any) => {
      const stats = response.features[0].attributes;
      const incomp = stats.total_boredpile_incomp;
      const comp = stats.total_boredpile_comp;
      const total = incomp + comp;

      const others_incomp = stats.total_others_incomp;
      const others_comp = stats.total_others_comp;
      const total_others = others_incomp + others_comp;

      return [incomp, comp, total, others_incomp, others_comp, total_others];
    });

  // Pile Cap
  const query_pilecap = new Query();
  query_pilecap.outStatistics = [
    total_pilecap_incomp,
    total_pilecap_comp,
    total_others_incomp,
    total_others_comp,
  ];
  contractp && (query_pilecap.where = expression);
  const pilecaps = stFoundationLayer
    ?.queryFeatures(query_pilecap)
    .then((response: any) => {
      const stats = response.features[0].attributes;
      const incomp = stats.total_pilecap_incomp;
      const comp = stats.total_pilecap_comp;
      const total = incomp + comp;

      const others_incomp = stats.total_others_incomp;
      const others_comp = stats.total_others_comp;
      const total_others = others_incomp + others_comp;

      return [incomp, comp, total, others_incomp, others_comp, total_others];
    });

  // Pier Columns
  const query_pier = new Query();
  query_pier.outStatistics = [
    total_pier_incomp,
    total_pier_comp,
    total_others_incomp,
    total_others_comp,
  ];
  contractp && (query_pier.where = expression);
  const piers = piersLayer?.queryFeatures(query_pier).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats.total_pier_incomp;
    const comp = stats.total_pier_comp;
    const total = incomp + comp;

    const others_incomp = stats.total_others_incomp;
    const others_comp = stats.total_others_comp;
    const total_others = others_incomp + others_comp;

    return [incomp, comp, total, others_incomp, others_comp, total_others];
  });

  // Pier Head
  const query_pierhead = new Query();
  query_pierhead.outStatistics = [
    total_pierhead_incomp,
    total_pierhead_comp,
    total_others_incomp,
    total_others_comp,
  ];
  contractp && (query_pierhead.where = expression);
  const pierheads = piersLayer
    ?.queryFeatures(query_pierhead)
    .then((response: any) => {
      const stats = response.features[0].attributes;
      const incomp = stats.total_pierhead_incomp;
      const comp = stats.total_pierhead_comp;
      const total = incomp + comp;

      const others_incomp = stats.total_others_incomp;
      const others_comp = stats.total_others_comp;
      const total_others = others_incomp + others_comp;

      return [incomp, comp, total, others_incomp, others_comp, total_others];
    });

  // Decks (precast)
  const query_decks = new Query();
  query_decks.outStatistics = [
    total_decks_incomp,
    total_decks_comp,
    total_others_incomp,
    total_others_comp,
  ];
  contractp && (query_decks.where = expression);
  const decks = decksLayer?.queryFeatures(query_decks).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats.total_decks_incomp;
    const comp = stats.total_decks_comp;
    const total = incomp + comp;

    const others_incomp = stats.total_others_incomp;
    const others_comp = stats.total_others_comp;
    const total_others = others_incomp + others_comp;

    return [incomp, comp, total, others_incomp, others_comp, total_others];
  });

  // Pier Walls
  const query_pierwalls = new Query();
  query_pierwalls.outStatistics = [
    total_pierwalls_incomp,
    total_pierwalls_comp,
    total_others_incomp,
    total_others_comp,
  ];
  contractp && (query_pierwalls.where = expression);
  const pierwalls = piersLayer
    ?.queryFeatures(query_pierwalls)
    .then((response: any) => {
      const stats = response.features[0].attributes;
      const incomp = stats.total_pierwalls_incomp;
      const comp = stats.total_pierwalls_comp;
      const total = incomp + comp;

      const others_incomp = stats.total_others_incomp;
      const others_comp = stats.total_others_comp;
      const total_others = others_incomp + others_comp;

      return [incomp, comp, total, others_incomp, others_comp, total_others];
    });

  // Others
  // const query_others = new Query();
  // query_others.outStatistics = [total_others_incomp, total_others_comp];
  // contractp && (query_others.where = expression + " AND " + "Types = 0");

  const boredpile = await piles;
  const pilecap = await pilecaps;
  const piercolumn = await piers;
  const pierhead = await pierheads;
  const deck = await decks;
  const pierwall = await pierwalls;

  // Completed total
  const total_comp =
    boredpile[1] +
    pilecap[1] +
    piercolumn[1] +
    pierhead[1] +
    deck[1] +
    pierwall[1];

  // grand total (comp + incomp)
  const total_all =
    boredpile[2] +
    pilecap[2] +
    piercolumn[2] +
    pierhead[2] +
    deck[2] +
    pierwall[2];

  // Others
  /// incomplete
  const total_incomp_others =
    boredpile[3] +
    pilecap[3] +
    piercolumn[3] +
    pierhead[3] +
    deck[3] +
    pierwall[3];

  const total_comp_others =
    boredpile[4] +
    pilecap[4] +
    piercolumn[4] +
    pierhead[4] +
    deck[4] +
    pierwall[4];

  const progress = ((total_comp / total_all) * 100).toFixed(1);

  const data = [
    {
      category: viatypes[0].category,
      comp: boredpile[1],
      incomp: boredpile[0],
      icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
    },
    {
      category: viatypes[1].category,
      comp: pilecap[1],
      incomp: pilecap[0],
      icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
    },
    {
      category: viatypes[2].category,
      comp: piercolumn[1],
      incomp: piercolumn[0],
      icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
    },
    {
      category: viatypes[3].category,
      comp: pierhead[1],
      incomp: pierhead[0],
      icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
    },
    {
      category: viatypes[4].category,
      comp: deck[1],
      incomp: deck[0],
      icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
    },
    {
      category: viatypes[6].category,
      comp: pierwall[1],
      incomp: pierwall[0],
      icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
    },
    {
      category: viatypes[7].category,
      comp: total_comp_others,
      incomp: total_incomp_others,
      icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_All_Logo.svg",
    },
  ];

  return [data, total_all, progress];
}

export async function generateChartData(contractp: any) {
  const total_boredpile_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 1 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_boredpile_incomp",
    statisticType: "sum",
  });

  const total_boredpile_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 1 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_boredpile_comp",
    statisticType: "sum",
  });

  const total_pilecap_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 2 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pilecap_incomp",
    statisticType: "sum",
  });

  const total_pilecap_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 2 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pilecap_comp",
    statisticType: "sum",
  });

  const total_pier_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 3 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pier_incomp",
    statisticType: "sum",
  });

  const total_pier_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 3 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pier_comp",
    statisticType: "sum",
  });

  const total_pierhead_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 4 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierhead_incomp",
    statisticType: "sum",
  });

  const total_pierhead_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 4 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_pierhead_comp",
    statisticType: "sum",
  });

  const total_precast_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 5 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_precast_incomp",
    statisticType: "sum",
  });

  const total_precast_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 5 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_precast_comp",
    statisticType: "sum",
  });

  const total_atgrade_incomp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 7 and Status = 1) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_atgrade_incomp",
    statisticType: "sum",
  });

  const total_atgrade_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN (Type = 7 and Status = 4) THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_atgrade_comp",
    statisticType: "sum",
  });

  // Query
  const query = viaductLayer.createQuery();
  query.outStatistics = [
    total_boredpile_incomp,
    total_boredpile_comp,
    total_pilecap_incomp,
    total_pilecap_comp,
    total_pier_incomp,
    total_pier_comp,
    total_pierhead_incomp,
    total_pierhead_comp,
    total_precast_incomp,
    total_precast_comp,
    total_atgrade_incomp,
    total_atgrade_comp,
  ];

  // Query
  const expression = "CP = '" + contractp + "'";
  pierNoLayer.definitionExpression = expression;
  query.where = expression;
  viaductLayer.definitionExpression = expression;

  return viaductLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const pile_incomp = stats.total_boredpile_incomp;
    const pile_comp = stats.total_boredpile_comp;
    const pilecap_incomp = stats.total_pilecap_incomp;
    const pilecap_comp = stats.total_pilecap_comp;
    const pier_incomp = stats.total_pier_incomp;
    const pier_comp = stats.total_pier_comp;
    const pierhead_incomp = stats.total_pierhead_incomp;
    const pierhead_comp = stats.total_pierhead_comp;
    const precast_incomp = stats.total_precast_incomp;
    const precast_comp = stats.total_precast_comp;
    const atgrade_incomp = stats.total_atgrade_incomp;
    const atgrade_comp = stats.total_atgrade_comp;

    const data = [
      {
        category: viatypes[0].category,
        comp: pile_comp,
        incomp: pile_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pile_Logo.svg",
      },
      {
        category: viatypes[1].category,
        comp: pilecap_comp,
        incomp: pilecap_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pilecap_Logo.svg",
      },
      {
        category: viatypes[2].category,
        comp: pier_comp,
        incomp: pier_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pier_Logo.svg",
      },
      {
        category: viatypes[3].category,
        comp: pierhead_comp,
        incomp: pierhead_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Pierhead_Logo.svg",
      },
      {
        category: viatypes[4].category,
        comp: precast_comp,
        incomp: precast_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
      },
      {
        category: viatypes[5].category,
        comp: atgrade_comp,
        incomp: atgrade_incomp,
        icon: "https://EijiGorilla.github.io/Symbols/Viaduct_Images/Viaduct_Precast_Logo.svg",
      },
    ];
    return data;
  });
}

export async function generateTotalProgress(contractp: any) {
  const total_viaduct_number = new StatisticDefinition({
    onStatisticField: "uniqueID",
    outStatisticFieldName: "total_viaduct_number",
    statisticType: "count",
  });

  const total_viaduct_comp = new StatisticDefinition({
    onStatisticField: "CASE WHEN Status = 4 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_viaduct_comp",
    statisticType: "sum",
  });

  const query = viaductLayer.createQuery();
  const defaultExpression = "CP = 'S-01'";
  const expression = "CP = '" + contractp + "'";

  if (!contractp) {
    query.where = defaultExpression;
  } else {
    query.where = expression;
  }
  query.outStatistics = [total_viaduct_number, total_viaduct_comp];

  return viaductLayer.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const comp = stats.total_viaduct_comp;
    const total = stats.total_viaduct_number;
    const progress = ((comp / total) * 100).toFixed(1);

    return [total, comp, progress];
  });
}

export async function timeSeriesChartData(contractp: any) {
  const total_complete_pile = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 1 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pile",
    statisticType: "sum",
  });

  const total_complete_pilecap = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 2 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pilecap",
    statisticType: "sum",
  });

  const total_complete_pier = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 3 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pier",
    statisticType: "sum",
  });

  const total_complete_pierhead = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 4 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_pierhead",
    statisticType: "sum",
  });

  const total_complete_precast = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 5 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_precast",
    statisticType: "sum",
  });

  const total_complete_atgrade = new StatisticDefinition({
    onStatisticField: "CASE WHEN Type = 7 THEN 1 ELSE 0 END",
    outStatisticFieldName: "total_complete_atgrade",
    statisticType: "sum",
  });

  const query = viaductLayerStatus4.createQuery();
  // eslint-disable-next-line no-useless-concat

  if (!contractp) {
    // eslint-disable-next-line no-useless-concat
    query.where = "finish_actual IS NOT NULL" + " AND " + "CP = 'S-01'";
  } else {
    // eslint-disable-next-line no-useless-concat
    query.where =
      "finish_actual IS NOT NULL" + " AND " + "CP = '" + contractp + "'";
  }

  query.outStatistics = [
    total_complete_pile,
    total_complete_pilecap,
    total_complete_pier,
    total_complete_pierhead,
    total_complete_precast,
    total_complete_atgrade,
  ];
  query.outFields = ["finish_actual", "CP"];
  query.orderByFields = ["finish_actual"];
  query.groupByFieldsForStatistics = ["finish_actual"];

  return viaductLayerStatus4.queryFeatures(query).then((response: any) => {
    const stats = response.features;

    // collect all dates for each viaduct type
    const data = stats.map((result: any) => {
      const attributes = result.attributes;
      const date = attributes.finish_actual;

      const pileCount = attributes.total_complete_pile;
      const pilecapCount = attributes.total_complete_pilecap;
      const pierCount = attributes.total_complete_pier;
      const pierheadCount = attributes.total_complete_pierhead;
      const precastCount = attributes.total_complete_precast;
      const atgradeCount = attributes.total_complete_atgrade;

      // compile in object
      return Object.assign(
        {},
        {
          date,
          pile: pileCount,
          pilecap: pilecapCount,
          pier: pierCount,
          piearhead: pierheadCount,
          precast: precastCount,
          atgrade: atgradeCount,
        },
      );
    });
    return data;
  });
}

// Thousand separators function
export function thousands_separators(num: any) {
  if (num) {
    const num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
}

export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

// Layer list
// For non-monitored components, make it invisible when opened.
export async function defineActions(event: any) {
  const { item } = event;
  if (item.layer.type !== "group") {
    item.panel = {
      content: "legend",
      open: true,
    };
  }
  item.title === "Chainage" ||
  item.title === "Viaduct" ||
  item.title === "Exterior Shell" ||
  item.title === "Specialty Equipment (Not Monitored)" ||
  item.title === "Structural Framing (Not Monitored)"
    ? (item.visible = false)
    : (item.visible = true);
}

// Set invisible layers
export const s01_sublayersVisibility = (
  categorySelected: any,
  expression: any,
) => {
  if (
    categorySelected === viatypes[0].category ||
    categorySelected === viatypes[1].category
  ) {
    stFoundationLayer.definitionExpression = expression;
    stFoundationLayer.visible = true;
    stFramingLayer.visible = false;
    bearingsLayer.visible = false;
    piersLayer.visible = false;
    decksLayer.visible = false;
  } else if (
    categorySelected === viatypes[2].category ||
    categorySelected === viatypes[3].category ||
    categorySelected === viatypes[6].category
  ) {
    piersLayer.definitionExpression = expression;
    piersLayer.visible = true;
    stFramingLayer.visible = false;
    bearingsLayer.visible = false;
    stFoundationLayer.visible = false;
    decksLayer.visible = false;
    specialtyEquipmentLayer.visible = false;
  } else if (categorySelected === viatypes[4].category) {
    decksLayer.definitionExpression = expression;
    decksLayer.visible = true;
    specialtyEquipmentLayer.visible = false;
    bearingsLayer.visible = false;
    stFoundationLayer.visible = false;
    piersLayer.visible = false;
    stFramingLayer.visible = false;
  } else if (categorySelected === "Others") {
    decksLayer.definitionExpression = expression;
    bearingsLayer.definitionExpression = expression;
    piersLayer.definitionExpression = expression;
    stFoundationLayer.definitionExpression = expression;
    decksLayer.visible = true;
    bearingsLayer.visible = true;
    piersLayer.visible = true;
    stFoundationLayer.visible = true;
    stFramingLayer.visible = false; // not part of monitoring
    specialtyEquipmentLayer.visible = false; // not part of monitoring
  }
};

// Highlight Layerview query
type layerViewQueryProps = {
  pointLayer1?: FeatureLayer;
  pointLayer2?: FeatureLayer;
  lineLayer1?: FeatureLayer;
  lineLayer2?: FeatureLayer;
  polygonLayer?: FeatureLayer | SceneLayer;
  qExpression?: any;
  view: any;
};

export const highlightSelectedUtil = (
  featureLayer: any,
  qExpression: any,
  view: any,
) => {
  const query = featureLayer.createQuery();
  query.where = qExpression;
  let highlightSelect: any;

  view?.whenLayerView(featureLayer).then((layerView: any) => {
    featureLayer?.queryObjectIds(query).then((results: any) => {
      const objID = results;

      // const queryExt = new Query({
      //   objectIds: objID,
      // });

      // try {
      //   featureLayer?.queryExtent(queryExt).then((result: any) => {
      //     if (result?.extent) {
      //       view?.goTo(result.extent);
      //     }
      //   });
      // } catch (error) {
      //   console.error("Error querying extent for point layer:", error);
      // }

      highlightSelect && highlightSelect.remove();
      highlightSelect = layerView.highlight(objID);
    });

    layerView.filter = new FeatureFilter({
      where: qExpression,
    });

    // For initial state, we need to add this
    view?.on("click", () => {
      layerView.filter = new FeatureFilter({
        where: undefined,
      });
      highlightSelect && highlightSelect.remove();
    });
  });
};

export const polygonViewQueryFeatureHighlight = ({
  polygonLayer,
  qExpression,
  view,
}: layerViewQueryProps) => {
  highlightSelectedUtil(polygonLayer, qExpression, view);
};
