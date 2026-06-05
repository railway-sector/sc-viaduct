import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer.js";
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";
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
  layers?:
    | [
        BuildingSceneLayer,
        BuildingSceneLayer?,
        BuildingSceneLayer?,
        BuildingSceneLayer?,
        BuildingSceneLayer?,
        BuildingSceneLayer?,
        BuildingSceneLayer?,
        BuildingSceneLayer?,
        SceneLayer?,
      ]
    | any;
  contractcp: string;
  buildingLayerCollection: any;
}

export const buildingSceneLayersList = [
  buildingLayer,
  viaductLayer,
  viaductLayer,
  viaductLayer,
  viaductLayer,
  viaductLayer,
  viaductLayer,
  viaductLayer,
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
  layers,
  contractcp,
  buildingLayerCollection,
}: visibilityBuildingLayersTypes) {
  if (layers) {
    buildingLayerCollection.map((item: any) => {
      if (item.cp === contractcp) {
        item.layer.visible = true;
      } else {
        item.layer.visible = false;
      }
    });
  }
}
