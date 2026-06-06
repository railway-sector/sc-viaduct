import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { buildingLayer, viaductLayer } from "./layers";
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

export const buildingSceneLayersList = [
  buildingLayer, // S-01
  viaductLayer, // S-02
  viaductLayer, // S-03a
  viaductLayer, // S-03b
  viaductLayer, // S-03c
  viaductLayer, //buildingLayer_s04, // S-04
  viaductLayer, // S-05
  viaductLayer, // S-06
];

export const buildingSceneLayersCollection = contractPackage.map(
  (cp: any, index: any) => {
    return Object.assign({
      cp: cp,
      layer: buildingSceneLayersList[index],
    });
  },
);

export function visibilityBuildingLayers({
  contractcp,
  layers,
}: visibilityBuildingLayersTypes) {
  layers.map((item: any) => {
    if (item.cp === contractcp) {
      item.layer.visible = true;
    } else {
      item.layer.visible = false;
    }
  });
}
