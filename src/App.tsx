import { useState, useEffect, useCallback, useMemo } from "react";
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
import { PackageContext } from "./contexts/PackageContext";
import { TsParamContext } from "./contexts/TsParamContext";
import { MediaContext } from "./contexts/MediaContext";
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

  //------------------------
  //  Package state
  //------------------------
  const [cpackage, setCpackage] = useState<any>(cpackages[0]);
  const updateCpackage = useCallback((newContractpackage: any) => {
    setCpackage(newContractpackage);
  }, []);

  const packageContextValue = useMemo(
    () => ({ cpackage, updateCpackage }),
    [cpackage, updateCpackage],
  );

  //------------------------
  //  TsParam state
  //------------------------
  const [newTsparam, setNewTsparam] = useState<any>(ts_field_q[0].datename);
  const updateNewTsparam = useCallback((newParam: any) => {
    setNewTsparam(newParam);
  }, []);

  const tsParamContextValue = useMemo(
    () => ({ newTsparam, updateNewTsparam }),
    [newTsparam, updateNewTsparam],
  );

  //------------------------
  //  Media state
  //------------------------
  const [mediaopen, setMediaopen] = useState<boolean>(false);
  const updateMediaopen = useCallback((newImageOpen: boolean) => {
    setMediaopen(newImageOpen);
  }, []);

  const [mediatype, setMediatype] = useState<string>();
  const updateMediatype = useCallback((newMedia: any) => {
    setMediatype(newMedia);
  }, []);

  const [mediapaths, setMediapaths] = useState<string>();
  const updateMediapaths = useCallback((newSrc: any) => {
    setMediapaths(newSrc);
  }, []);

  const [mediascale, setMediascale] = useState<any>(image_scales[0]);
  const updateMediascale = useCallback((newScale: any) => {
    setMediascale(newScale);
  }, []);

  const [mediatimestamp, setMediatimestamp] = useState<any>();
  const updateMediatimestamp = useCallback((newTime: any) => {
    setMediatimestamp(newTime);
  }, []);

  const mediaContextValue = useMemo(
    () => ({
      mediaopen,
      updateMediaopen,
      mediatype,
      updateMediatype,
      mediapaths,
      updateMediapaths,
      mediascale,
      updateMediascale,
      mediatimestamp,
      updateMediatimestamp,
    }),
    [
      mediaopen,
      updateMediaopen,
      mediatype,
      updateMediatype,
      mediapaths,
      updateMediapaths,
      mediascale,
      updateMediascale,
      mediatimestamp,
      updateMediatimestamp,
    ],
  );

  return (
    <>
      {loggedInState === true && (
        <div>
          <calcite-shell
            style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #555" }}
          >
            <PackageContext value={packageContextValue}>
              <TsParamContext value={tsParamContextValue}>
                <MediaContext value={mediaContextValue}>
                  <QueryClientProvider client={queryClient}>
                    <ActionPanel />
                    <MapDisplay />
                    {buildingLayerLoaded === "loaded" && <Chart />}
                    <Header />
                  </QueryClientProvider>
                </MediaContext>
              </TsParamContext>
            </PackageContext>
          </calcite-shell>
        </div>
      )}
    </>
  );
}

export default App;
