import { useState, useEffect, useCallback } from "react";
import "./index.css";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-shell";

import MapDisplay from "./components/MapDisplay";
import ActionPanel from "./components/ActionPanel";
import Header from "./components/Header";
import Chart from "./components/Chart";
import { buildingLayer } from "./layers";
import { MyContext } from "./contexts/MyContext";
import { cpackages, image_scales, ts_field_q } from "./uniqueValues";
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
  }, []);

  useEffect(() => {
    authenticate(setLoggedInState, "BzPSdSndE64wbsGK");
  }, []);

  const [cpackage, setCpackage] = useState<any>(cpackages[0]);
  const [newTsparam, setNewTsparam] = useState<any>(ts_field_q[0].datename);
  const [layersRevit, setLayersRevit] = useState<any>();
  const [mediaopen, setMediaopen] = useState<boolean>(false);
  const [mediatype, setMediatype] = useState<string>();
  const [mediapaths, setMediapaths] = useState<string>();
  const [mediascale, setMediascale] = useState<any>(image_scales[0]);
  const [mediatimestamp, setMediatimestamp] = useState<any>();

  // useCallback: stable references so context consumers don't re-render
  // unnecessarily. [] deps are safe here because these only call setState.
  // Components with the relevent references are only rendered.
  const updateCpackage = useCallback((newContractpackage: any) => {
    setCpackage(newContractpackage);
  }, []);

  const updateNewTsparam = useCallback((newParam: any) => {
    setNewTsparam(newParam);
  }, []);

  const updateLayersRevit = useCallback((newRevit: any) => {
    setLayersRevit(newRevit);
  }, []);

  const updateMediaopen = useCallback((newImageOpen: boolean) => {
    setMediaopen(newImageOpen);
  }, []);

  const updateMediatype = useCallback((newMedia: any) => {
    setMediatype(newMedia);
  }, []);

  const updateMediapaths = useCallback((newSrc: any) => {
    setMediapaths(newSrc);
  }, []);

  const updateMediascale = useCallback((newScale: any) => {
    setMediascale(newScale);
  }, []);

  const updateMediatimestamp = useCallback((newTime: any) => {
    setMediatimestamp(newTime);
  }, []);

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
                newTsparam,
                layersRevit,
                mediaopen,
                mediatype,
                mediapaths,
                mediascale,
                mediatimestamp,
                updateCpackage,
                updateNewTsparam,
                updateLayersRevit,
                updateMediatimestamp,
                updateMediaopen,
                updateMediatype,
                updateMediapaths,
                updateMediascale,
              }}
            >
              <QueryClientProvider client={queryClient}>
                <ActionPanel />
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
