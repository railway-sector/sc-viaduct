import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type { TypeFieldType } from "./uniqueValues";

//--------------------------------//
//    queryExpression             //
//--------------------------------//
interface queryExpressionType {
  q1Value?: any;
  q1Field?: any;
  q2Value?: any;
  q2Field?: any;
  q3Value?: any;
  q3Field?: any;
  chartCategory?: any;
  chartCategoryField?: any;
  chartCategoryType?: TypeFieldType;
  status?: number;
  statusField?: any;
  qExpression?: any;
}
export function queryExpression({
  q1Value,
  q1Field,
  q2Value,
  q2Field,
  q3Value,
  q3Field,
  chartCategory,
  chartCategoryField,
  chartCategoryType,
  status,
  statusField,
  qExpression,
}: queryExpressionType) {
  //--- Basic query expression
  const query1 =
    typeof q1Value === "number"
      ? `${q1Field} = ${q1Value}`
      : `${q1Field} = '${q1Value}'`;
  const query2 =
    typeof q2Value === "number"
      ? `${q2Field} = ${q2Value}`
      : `${q2Field} = '${q2Value}'`;
  const query3 =
    typeof q3Value === "number"
      ? `${q3Field} = ${q3Value}`
      : `${q3Field} = '${q3Value}'`;
  const query12 = `${query1} AND ${query2}`;
  const query123 = `${query1} AND ${query2} AND ${query3}`;
  const q_status = `${statusField} = ${status}`;
  const q_chartC =
    chartCategoryType === "string"
      ? `${chartCategoryField} = '${chartCategory}'`
      : `${chartCategoryField} = ${chartCategory}`;
  const q_status_chartC = `${q_status} AND ${q_chartC}`;
  const query1_chartC = `${query1} AND ${q_chartC}`;
  const query12_chartC = `${query12} AND ${q_chartC}`;
  const query123_chartC = `${query123} AND ${q_chartC}`;
  const query1_status = `${query1} AND ${q_status}`;
  const query12_status = `${query12} AND ${q_status}`;
  const query123_status = `${query123} AND ${q_status}`;
  const query1_status_chartC = `${query1_status} AND ${q_chartC}`;
  const query12_status_chartC = `${query12_status} AND ${q_chartC}`;
  const query123_status_chartC = `${query123_status} AND ${q_chartC}`;

  //--- With qExpression
  const query1_qE = `${query1} AND ${qExpression}`;
  const query12_qE = `${query12} AND ${qExpression}`;
  const query123_qE = `${query123} AND ${qExpression}`;
  const q_status_qE = `${q_status} AND ${qExpression}`;
  const q_chartC_qE = `${q_chartC} AND ${qExpression}`;
  const q_status_chartC_qE = `${q_status_chartC} AND ${qExpression}`;
  const query1_chartC_qE = `${query1_chartC} AND ${qExpression}`;
  const query12_chartC_qE = `${query12_chartC} AND ${qExpression}`;
  const query123_chartC_qE = `${query123_chartC} AND ${qExpression}`;
  const query1_status_qE = `${query1_status} AND ${qExpression}`;
  const query12_status_qE = `${query12_status} AND ${qExpression}`;
  const query123_status_qE = `${query123_status} AND ${qExpression}`;
  const query1_status_chartC_qE = `${query1_status_chartC} AND ${qExpression}`;
  const query12_status_chartC_qE = `${query12_status_chartC} AND ${qExpression}`;
  const query123_status_chartC_qE = `${query123_status_chartC} AND ${qExpression}`;

  let expression = "";
  if (qExpression) {
    if (chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_chartC_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_chartC_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_chartC_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_chartC_qE;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_chartC_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_chartC_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_chartC_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_chartC_qE;
        }
      }
    } else if (!chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_qE;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_qE;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = qExpression;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_qE;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_qE;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_qE;
        }
      }
    }
  } else if (!qExpression) {
    if (chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status_chartC;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status_chartC;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status_chartC;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status_chartC;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_chartC;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_chartC;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_chartC;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_chartC;
        }
      }
    } else if (!chartCategoryField) {
      if (statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = q_status;
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1_status;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12_status;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123_status;
        }
      } else if (!statusField) {
        if (!q1Value && !q2Value && !q3Value) {
          expression = "1=1";
        } else if (q1Value && !q2Value && !q3Value) {
          expression = query1;
        } else if (q1Value && q2Value && !q3Value) {
          expression = query12;
        } else if (q1Value && q2Value && q3Value) {
          expression = query123;
        }
      }
    }
  }
  return expression;
}

//---------------------------------------------------------//
//    Definition Expression using queryExpression          //
//---------------------------------------------------------//
interface queryDefinitionExpressionType {
  queryExpression?: string;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
}: queryDefinitionExpressionType) {
  if (queryExpression) {
    if (featureLayer) {
      if (Array.isArray(featureLayer)) {
        featureLayer.forEach((layer) => {
          if (layer) {
            layer.definitionExpression = queryExpression;
            layer.visible = true;
          }
        });
      } else {
        featureLayer.definitionExpression = queryExpression;
        featureLayer.visible = true;
      }
    }
  }
}
