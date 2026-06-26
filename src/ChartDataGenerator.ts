import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer.js";
import { type_field_revit } from "./uniqueValues";
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

export async function chartDataForRevit({
  qChart,
  chartCategoryTypes,
  layers,
  statusState,
}: chartDataGenerationType) {
  const typesV = chartCategoryTypes.map((name: any) => name.value);
  const types = chartCategoryTypes.map((name: any) => name.category);

  const data0 = layers.map(async (sublayer: any) => {
    const compile: any = [];

    //--- Main statistics
    typesV.map((type: any) => {
      statusState.map((status: any) => {
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
    //-- query sublayer
    // 11, 12, 13, 14, => 0, 1, 2, 3,
    // 21, 22, 23, 24, => 4, 5, 6, 7,
    // 31, 32, 33, 34, => 8, 9, 10, 11,
    // 41, 42, 43, 44,
    // 51, 52, 53, 54,
    // 61, 62, 63, 64,
    // 71, 72, 73, 74,
    // 81, 82, 83, 84,
    // 91, 92, 93, 94,
    // 01, 02, 03, 04, => 37, 38, 39. 40

    const response = await sublayer?.queryFeatures(query);
    return await chartStatsBySublayer({
      types: types,
      statusState: statusState,
      stats: response.features[0].attributes,
      compile: compile,
    });
  });

  //---- Compile data by type and status
  return await chartStatsCompile({
    data: await Promise.all(data0),
    types: types,
    layers: layers,
  });
}

interface chartStatsCompile {
  data: any;
  types: any;
  layers: any;
}

export async function chartStatsCompile({
  data,
  types,
  layers,
}: chartStatsCompile) {
  let total_all = 0;
  let total_comp = 0;
  const data2 = types.map((type: any) => {
    const temp = layers.map((_sublayer: any, j: any) => {
      const match = data[j].filter((item: any) => item.category === type)[0];
      return Object.assign({
        category: type,
        incomp: match?.incomp,
        ongoing: match?.ongoing,
        delayed: match?.delayed,
        comp: match?.comp,
      });
    });
    //--- sum up for each sublayer
    const incomp = temp.reduce((sum: any, item: any) => sum + item.incomp, 0);
    const ongoing = temp.reduce((sum: any, item: any) => sum + item.ongoing, 0);
    const delayed = temp.reduce((sum: any, item: any) => sum + item.delayed, 0);
    const comp = temp.reduce((sum: any, item: any) => sum + item.comp, 0);

    total_all += incomp + ongoing + delayed + comp;
    total_comp += comp;

    return Object.assign({
      category: type,
      incomp: incomp,
      ongoing: ongoing,
      delayed: delayed,
      comp: comp,
    });
  });

  const progress =
    total_all > 0 ? ((total_comp / total_all) * 100).toFixed(1) : "0.0";

  return [data2, total_all, progress];
}

interface chartStatsBySublayer {
  types: any;
  statusState: any;
  stats: any;
  compile: any;
}

export async function chartStatsBySublayer({
  types,
  statusState,
  stats,
  compile,
}: chartStatsBySublayer) {
  let k = 0;
  return types.map((category: any) => {
    let temp: any = [];
    statusState.map((_status: any) => {
      temp.push(stats[compile[k].outStatisticFieldName]);
      k += 1;
    });
    return Object.assign({
      category: category,
      incomp: temp[0],
      ongoing: temp[1],
      delayed: temp[2],
      comp: temp[3],
    });
  });
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
  const response = await layers?.queryFeatures(query);
  const stats = response.features[0].attributes;
  const incomp = stats[compile[0].outStatisticFieldName];
  const ongoing = stats[compile[1].outStatisticFieldName];
  const delayed = stats[compile[2].outStatisticFieldName];
  const comp = stats[compile[3].outStatisticFieldName];
  const total = incomp + ongoing + delayed + comp;

  return [incomp, comp, ongoing, delayed, total];
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
