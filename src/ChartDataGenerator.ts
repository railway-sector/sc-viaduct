import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";
import BuildingComponentSublayer from "@arcgis/core/layers/buildingSublayers/BuildingComponentSublayer.js";
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
  chartCategoryTypeField?: any;
  layers: any;
  statusField: any;
  statusState: any;
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
  qChart,
  chartCategoryTypes,
  chartCategoryTypeField,
  layers,
  statusField,
  statusState,
}: chartDataGenerationType) {
  const typesV = chartCategoryTypes.map((name: any) => name.value);
  const types = chartCategoryTypes.map((name: any) => name.category);

  const data0 = layers.map(async (layer: any) => {
    const compile: any = [];

    //--- Main statistics
    typesV.map((type: any) => {
      statusState.map((status: any) => {
        const typev = typeof type === "number" ? `${type}` : `'${type}'`;
        const temp = new StatisticDefinition({
          onStatisticField: `CASE WHEN (${chartCategoryTypeField} = ${typev} and ${statusField} = ${status}) THEN 1 ELSE 0 END`,
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

    const response = await layer?.queryFeatures(query);
    return await chartStatsBySublayer({
      types: types,
      statusState: statusState,
      stats: response.features[0].attributes,
      compile: compile,
    });
  });

  //--- Compile data by type and status
  return await chartStatsCompile({
    data: await Promise.all(data0),
    types: types,
    layers: layers,
  });
}
