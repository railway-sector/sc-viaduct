import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { cpackages } from "./uniqueValues";

//---------------------------------------------------------//
//    Definition Expression using queryExpression          //
//---------------------------------------------------------//
interface queryDefinitionExpressionType {
  queryExpression?: any;
  featureLayer?:
    | [FeatureLayer, FeatureLayer?, FeatureLayer?, FeatureLayer?, FeatureLayer?]
    | any;
}

export function queryDefinitionExpression({
  queryExpression,
  featureLayer,
}: queryDefinitionExpressionType) {
  if (!queryExpression || !featureLayer) return;
  const layers = Array.isArray(featureLayer) ? featureLayer : [featureLayer];
  layers.forEach(
    (layer: any) =>
      layer &&
      ((layer.definitionExpression = queryExpression), (layer.visible = true)),
  );
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
  const hide_cps = cpackages.filter((item) => item !== contractcp);
  hide_cps.map((cp) => {
    layers[cp].visible = false;
  });
}
