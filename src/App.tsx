import { useState, useEffect } from "react";
import "./index.css";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-shell";

import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import UndergroundSwitch from "./components/UndergroundSwitch";
import Chart from "./components/Chart";
import { buildingLayer } from "./layers";
import { MyContext } from "./contexts/MyContext";
import {
  contractPackage,
  image_scales,
  timeSliderParameters,
} from "./uniqueValues";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authenticate } from "./autho";

const queryClient = new QueryClient();

export function App(): React.JSX.Element {
  const [loggedInState, setLoggedInState] = useState<boolean>(false);
  const [buildingLayerLoaded, setBuildingLayerLoaded] = useState<any>(); // 'loaded'

  useEffect(() => {
    buildingLayer.load().then(() => {
      setBuildingLayerLoaded(buildingLayer.loadStatus);
    });
  });

  useEffect(() => {
    authenticate(setLoggedInState, "BzPSdSndE64wbsGK");
  }, []);

  const [cpackage, setCpackage] = useState<any>(contractPackage[0]);
  const [newTimeSliderparam, setNewTimeSliderparam] = useState<any>(
    timeSliderParameters[0],
  );

  const [layersRevit, setLayersRevit] = useState<any>();
  const [imageopen, setImageOpen] = useState<boolean>(false);
  const [mediatype, setMediatype] = useState<string>();
  const [mediasrcpaths, setMediasrcpaths] = useState<string>();
  const [mediaSelectedscale, setMediaSelectedscale] = useState<any>(
    image_scales[0],
  );
  const [mediatimestamp, setMediatimestamp] = useState<any>();

  const updateCpackage = (newContractpackage: any) => {
    setCpackage(newContractpackage);
  };

  const updateNewTimeSliderparam = (newParam: any) => {
    setNewTimeSliderparam(newParam);
  };

  const updateLayersRevit = (newRevit: any) => {
    setLayersRevit(newRevit);
  };

  const updateImageOpen = (newImageOpen: any) => {
    setImageOpen(newImageOpen);
  };

  const updateMediatype = (newMedia: any) => {
    setMediatype(newMedia);
  };

  const updateMediasrcpaths = (newSrc: any) => {
    setMediasrcpaths(newSrc);
  };

  const updateMediaSelectedscale = (newScale: any) => {
    setMediaSelectedscale(newScale);
  };

  const updateMediatimestamp = (NewTime: any) => {
    setMediatimestamp(NewTime);
  };

  return (
    <>
      {loggedInState === true && (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <MyContext
              value={{
                cpackage,
                newTimeSliderparam,
                layersRevit,
                imageopen,
                mediatype,
                mediasrcpaths,
                mediaSelectedscale,
                mediatimestamp,
                updateCpackage,
                updateNewTimeSliderparam,
                updateLayersRevit,
                updateMediatimestamp,
                updateImageOpen,
                updateMediatype,
                updateMediasrcpaths,
                updateMediaSelectedscale,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
                <UndergroundSwitch />
                <MapDisplay />
                {buildingLayerLoaded === "loaded" && <Chart />}
                <Header />
              </QueryClientProvider>
            </MyContext>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;
