import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Query from "@arcgis/core/rest/support/Query";

//-------------------------------------//
//        Chart Data generation        //
//-------------------------------------//
// interface chartDataGenerationType {
//   q1Value?: any;
//   q1Field?: any;
//   qChart: any;
//   chartCategoryTypes: any;
//   chartCategoryTypeField?: any;
//   layers: any;
//   statusField: any;
//   statusState: any;
// }

interface chartStatsCompile {
  data: any;
  types: any;
  layers: any;
}

interface chartStatsBySublayer {
  types: any;
  statusState: any;
  stats: any;
  compile: any;
}

interface chartDataQueryType {
  qChart: any;
  layer: any;
  statusState: any;
  statusField: any;
}

interface chartStackColumnsType {
  //   data: any;
  qChart: any;
  categoryTypes: any;
  categoryTypeField?: any;
  layers: any;
  statusField: any;
  statusState: any;
}

//--- shared helper ---//
function computeProgress(comp: number, total: number): string {
  return total > 0 ? ((comp / total) * 100).toFixed(1) : "0.0";
}

//--- sub-functions ---//
async function chartStatsBySublayer({
  types,
  statusState,
  stats,
  compile,
}: chartStatsBySublayer) {
  let k = 0;
  return types.map((type: any) => {
    const temp: any[] = statusState.map(
      () => stats[compile[k++].outStatisticFieldName],
    );

    return {
      category: type.category,
      incomp: temp[0],
      ongoing: temp[1],
      delayed: temp[2],
      comp: temp[3],
    };
  });
}

async function chartStatsCompile({ data, types, layers }: chartStatsCompile) {
  let total_all = 0;
  let total_comp = 0;

  const data2 = types.map((type: any) => {
    const temp = layers.map((_layer: any, j: any) => {
      const match = data[j].filter((f: any) => f.category === type.category)[0];
      return {
        category: type.category,
        incomp: match?.incomp ?? 0,
        ongoing: match?.ongoing ?? 0,
        delayed: match?.delayed ?? 0,
        comp: match?.comp ?? 0,
      };
    });

    //--- sum up for each sublayer
    const totals = temp.reduce(
      (acc: any, item: any) => {
        acc.incomp += item.incomp;
        acc.ongoing += item.ongoing;
        acc.delayed += item.delayed;
        acc.comp += item.comp;
        return acc;
      },
      { incomp: 0, ongoing: 0, delayed: 0, comp: 0 },
    );

    total_all += totals.incomp + totals.ongoing + totals.delayed + totals.comp;
    total_comp += totals.comp;

    return {
      category: type.category,
      incomp: totals.incomp,
      ongoing: totals.ongoing,
      delayed: totals.delayed,
      comp: totals.comp,
      icon: type.icon,
    };
  });

  const progress = computeProgress(total_comp, total_all);

  return [data2, total_all, progress, total_comp];
}

async function chartDataQuery({
  qChart: qChart,
  layer: layer,
  statusState: statusState,
  statusField: statusField,
}: chartDataQueryType) {
  const compile: StatisticDefinition[] = statusState.map((status: any) => {
    return new StatisticDefinition({
      onStatisticField: `CASE WHEN ${statusField} = ${status} THEN 1 ELSE 0 END`,
      outStatisticFieldName: `viaduct_stats${status}`,
      statisticType: "sum",
    });
  });

  //--- Query
  const query = new Query();
  query.outStatistics = compile;
  query.where = qChart;

  const response = await layer?.queryFeatures(query);
  const stats = response.features[0].attributes;

  const counts = compile.map(
    (def: any) => stats[def.outStatisticFieldName] || 0,
  );
  const total = counts.reduce((sum: any, val: any) => sum + val, 0);
  return [...counts, total];
}

class ChartStackColumns implements chartStackColumnsType {
  //   data: any;
  qChart: any;
  categoryTypes: any;
  categoryTypeField: any;
  layers: any;
  statusField: any;
  statusState: any;

  constructor(
    qChart: any = null,
    categoryTypes: any = null,
    categoryTypeField: any = null,
    layers: any = null,
    statusField: any = null,
    statusState: any = null,
  ) {
    this.qChart = qChart;
    this.categoryTypes = categoryTypes;
    this.categoryTypeField = categoryTypeField;
    this.layers = layers;
    this.statusField = statusField;
    this.statusState = statusState;
  }

  chartDataStackColumns = async (): Promise<any> => {
    //--------------------------------------------------//
    // TWO types when a stacked-column chart is created
    // 1: CATEGORY OR TYPE EXITS
    //    - Indication of type field in the attribute table
    //    - Use this type for computing statistics
    //    - A sublayer may have multiple types.
    //
    // 2: NO CATEGORY OR TYPE
    //    - No type field used
    //    - Indication of computing statistics by layer

    //--------------------------//
    //     1: CATEGORY EXISTS   //
    //--------------------------//
    if (this.categoryTypeField) {
      const typesV = this.categoryTypes.map((name: any) => name.value);

      const dataPromises = this.layers.map(async (layer: any) => {
        const compile: StatisticDefinition[] = [];

        typesV.forEach((type: any, index: any) => {
          this.statusState.forEach((status: any) => {
            const typev = typeof type === "number" ? `${type}` : `'${type}'`;
            compile.push(
              new StatisticDefinition({
                onStatisticField: `CASE WHEN (${this.categoryTypeField} = ${typev} and ${this.statusField} = ${status}) THEN 1 ELSE 0 END`,
                outStatisticFieldName: `viaduct_stats${index}${status}`,
                statisticType: "sum",
              }),
            );
          });
        });

        //--- Query
        const query = new Query();
        query.outStatistics = compile;
        query.where = this.qChart;

        const response = await layer?.queryFeatures(query);
        return await chartStatsBySublayer({
          types: this.categoryTypes,
          statusState: this.statusState,
          stats: response.features[0].attributes,
          compile,
        });
      });

      const resolvedData = await Promise.all(dataPromises);

      //--- Compile data by type and status
      return await chartStatsCompile({
        data: resolvedData,
        types: this.categoryTypes,
        layers: this.layers,
      });

      //--------------------------//
      //   2: NO CATEGORY EXISTS  //
      //--------------------------//
    } else {
      let total_comp = 0;
      let total_all = 0;

      const dataPromises = this.layers.map(async (layer: any, index: any) => {
        const typeConfig = this.categoryTypes.find(
          (e: any) => e.modelName === layer.modelName,
        );
        const category = typeConfig ? typeConfig.category : "Unknown";

        const stats = await chartDataQuery({
          qChart: this.qChart,
          layer: layer,
          statusState: this.statusState,
          statusField: this.statusField,
        });

        //--- Compute total numbers for completed and grand total
        total_comp += stats[3];
        total_all += stats[4];

        return {
          category,
          incomp: stats[0],
          ongoing: stats[1],
          delayed: stats[2],
          comp: stats[3],
          icon: this.categoryTypes[index].icon ?? null,
        };
      });

      //--- Resolve Promise all
      const data = await Promise.all(dataPromises);
      const progress = computeProgress(total_comp, total_all);

      return [data, total_all, progress, total_comp];
    }
  };
}

export default ChartStackColumns;
