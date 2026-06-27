import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { contractPackage } from "./uniqueValues";

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

//--- Visibility building layers and viaduct
interface visibilityBuildingLayersTypes {
  contractcp: string;
  layers: any;
}

export function visibilityBuildingLayers({
  contractcp,
  layers,
}: visibilityBuildingLayersTypes) {
  //--- visible
  layers[contractcp].visible = true;

  //--- invisible
  const hide_cps = contractPackage.filter((item) => item !== contractcp);
  hide_cps.map((cp) => {
    layers[cp].visible = false;
  });
}
