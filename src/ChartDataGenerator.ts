import { pierNoLayer, viaductLayer } from "./layers";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer.js";
import { type_field_revit, viatypes } from "./uniqueValues";
import { queryDefinitionExpression } from "./QueryExpression";
import type { TypeFieldType } from "./uniqueValues";

//-------------------------------------//
//        Chart Data generation        //
//-------------------------------------//

//---- Building Layer ---//
interface chartDataGenerationType {
  q1Value?: any;
  q1Field?: any;
  qChart: any;
  chartCategoryTypes: any;
  layers: any;
  statusState: any;
}

export async function chartDataR(
  qChart: any,
  types_chosen: any,
  layer: any,
  statusState: any,
) {
  //--- types: include 'others'. Each main type may have others (types = 0)
  const compile: any = [];

  //--- Main statistics
  types_chosen.map((type: any) => {
    // [0, 1]
    statusState.map((status: any) => {
      // [1, 4]
      const temp = new StatisticDefinition({
        onStatisticField: `CASE WHEN (${type_field_revit} = ${type} and Status = ${status}) THEN 1 ELSE 0 END`,
        outStatisticFieldName: `viaduct_stats${type}${status}`,
        statisticType: "sum",
      });
      compile.push(temp);
    });
  });

  //--- Query
  const query = new Query();
  query.outStatistics = compile;
  query.where = qChart;
  queryDefinitionExpression({
    queryExpression: qChart,
    featureLayer: [pierNoLayer, viaductLayer],
  });

  //--- Query features using statistics definitions
  // Note the above order: [01, 04, 11, 14] = [type/status...]
  // Reorder for returned values: [11, 14, ]
  const qStats = layer?.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats[compile[4].outStatisticFieldName];
    const ongoing = stats[compile[5].outStatisticFieldName];
    const delayed = stats[compile[6].outStatisticFieldName];
    const comp = stats[compile[7].outStatisticFieldName];
    const others_incomp = stats[compile[0].outStatisticFieldName];
    const others_ongoing = stats[compile[1].outStatisticFieldName];
    const others_delayed = stats[compile[2].outStatisticFieldName];
    const others_comp = stats[compile[3].outStatisticFieldName];
    const total = incomp + ongoing + delayed + comp;
    const total_others =
      others_incomp + others_ongoing + others_delayed + others_comp;
    return [
      incomp,
      ongoing,
      delayed,
      comp,
      total,
      others_incomp,
      others_ongoing,
      others_delayed,
      others_comp,
      total_others,
    ];
  });
  return qStats;
}

export async function chartDataForRevit({
  qChart,
  chartCategoryTypes,
  layers,
  statusState,
}: chartDataGenerationType) {
  // [0, 1] = type['others', 'bored pile']
  let total_comp = 0;
  let total_all = 0;
  let total_others_incomp = 0;
  let total_others_ongoing = 0;
  let total_others_delayed = 0;
  let total_others_comp = 0;

  const data0 = chartCategoryTypes.map(async (type: any, index: any) => {
    if (type != "Others") {
      //--- Extract type value and icon from the sorce list
      const type_matched = viatypes.find((item) => item.category === type);

      //--- Calculate statistics
      const stats = await chartDataR(
        qChart,
        [0, type_matched?.value], // bored pile: [0, 1]
        layers[index], // bored pile: stFoundation
        statusState, // e.g., [1, 2, 3, 4]
      );

      //--- Extract others
      total_others_incomp += stats[5];
      total_others_ongoing += stats[6];
      total_others_delayed += stats[7];
      total_others_comp += stats[8];

      //--- Compute total numbers for completed and grand total
      total_comp += stats[3];
      total_all += stats[4];
      return Object.assign({
        category: type,
        comp: stats[3],
        incomp: stats[0],
        ongoing: stats[1],
        delayed: stats[2],
        icon: type_matched?.icon,
      });
    }
  });

  //--- Resolve Promise all
  const data = await Promise.all(data0);
  const progress =
    total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

  //--- Others
  const others = [
    {
      category: "Others",
      comp: total_others_comp,
      incomp: total_others_incomp,
      ongoing: total_others_ongoing,
      delayed: total_others_delayed,
      icon: viatypes[0].icon,
    },
  ];

  //-- Include others
  const updatedData = [...data, ...others];
  return [updatedData, total_all, progress];
}

//---- Multipatch (Scene) Layer ---//
interface queryBuildingLayersType {
  q1Value?: any;
  q1Field?: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  qChart?: any;
  chartCategoryTypes?: any;
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryValueType?: TypeFieldType;
  layers:
    | [
        BuildingComponentSublayer,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
        BuildingComponentSublayer?,
      ]
    | any;
  status?: number;
  statusState?: any;
  statusField?: any;
  qExpression?: any;
}

export async function chartDataQuery({
  qChart: qChart,
  layers: layers,
  statusState: statusState,
  statusField: statusField,
}: queryBuildingLayersType) {
  //--- types: include 'others'. Each main type may have others (types = 0)
  const compile: any = [];

  //--- Main statistics
  statusState.map((status: any) => {
    const temp = new StatisticDefinition({
      onStatisticField: `CASE WHEN ${statusField} = ${status} THEN 1 ELSE 0 END`,
      outStatisticFieldName: `stats${status}`,
      statisticType: "sum",
    });
    compile.push(temp);
  });

  //--- Query
  const query = new Query();
  query.outStatistics = compile;
  query.where = qChart;

  //--- Query features using statistics definitions
  const qStats = layers?.queryFeatures(query).then((response: any) => {
    const stats = response.features[0].attributes;
    const incomp = stats[compile[0].outStatisticFieldName];
    const ongoing = stats[compile[1].outStatisticFieldName];
    const delayed = stats[compile[2].outStatisticFieldName];
    const comp = stats[compile[3].outStatisticFieldName];
    const total = incomp + ongoing + delayed + comp;

    return [incomp, comp, ongoing, delayed, total];
  });
  return qStats;
}

export async function chartDataStackColumns({
  qChart: qChart,
  layers: layers,
  chartCategoryTypes: chartCategoryTypes,
  chartCategoryField: chartCategoryField,
  chartCategoryValueType: chartCategoryValueType,
  statusState: statusState,
  statusField: statusField,
}: queryBuildingLayersType) {
  if (chartCategoryField) {
    // 1. Map through types and return a promise for each type
    const promises = chartCategoryTypes.map(async (type: any) => {
      let total_comp = 0;
      let total_incomp = 0;
      let total_ongoing = 0;
      let total_delayed = 0;

      // 2. Use Promise.all to wait for all statuses
      await Promise.all(
        statusState.map(async (status: any) => {
          const onStatisticField =
            chartCategoryValueType === "number"
              ? `CASE WHEN (${chartCategoryField} = ${type.value} AND ${statusField} = ${status}) THEN 1 ELSE 0 END`
              : `CASE WHEN (${chartCategoryField} = '${type.value}' AND ${statusField} = ${status}) THEN 1 ELSE 0 END`;

          const temp = new StatisticDefinition({
            onStatisticField: onStatisticField,
            outStatisticFieldName: "temp",
            statisticType: "sum",
          });

          const query = new Query();
          query.outStatistics = [temp];
          query.where = qChart;

          // 3. Await layer queries
          for (const layer of layers) {
            const response = await layer.queryFeatures(query);
            const stats = response.features[0]?.attributes;
            if (stats) {
              if (status === 1) total_incomp += stats["temp"] || 0;
              if (status === 2) total_ongoing += stats["temp"] || 0;
              if (status === 3) total_delayed += stats["temp"] || 0;
              if (status === 4) total_comp += stats["temp"] || 0;
            }
          }
        }),
      );

      // Return the compiled result for this type
      return {
        category: type.category,
        comp: total_comp,
        incomp: total_incomp,
        ongoing: total_ongoing,
        delayed: total_delayed,
      };
    });

    // 4. Wait for all type calculations to finish
    const results = await Promise.all(promises);
    const total_comp = results.reduce(
      (sum: any, item: any) => sum + item.comp,
      0,
    );
    const total_all = results.reduce(
      (sum: any, item: any) =>
        sum + item.comp + item.incomp + item.ongoing + item.delayed,
      0,
    );
    const progress =
      total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

    return [results, total_all, progress];
    //--------------------------//
    //    only status field     //
    //--------------------------//
  } else {
    let total_comp = 0;
    let total_all = 0;

    const data0 = chartCategoryTypes.map(async (type: any, index: any) => {
      //--- Calculate statistics
      const stats = await chartDataQuery({
        qChart: qChart,
        layers: layers[index],
        statusState: statusState,
        statusField: statusField,
      });

      //--- Compute total numbers for completed and grand total
      total_comp += stats[1];
      total_all += stats[4];

      return Object.assign({
        category: type.category,
        comp: stats[1],
        incomp: stats[0],
        ongoing: stats[2],
        delayed: stats[3],
      });
    });

    //--- Resolve Promise all
    const data = await Promise.all(data0);
    const progress =
      total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

    return [data, total_all, progress];
  }
}
