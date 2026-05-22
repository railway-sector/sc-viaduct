import { createContext } from "react";

type MyDropdownContextType = {
  contractpackages: any;
  newTimeSliderparam: any;
  chartPanelwidth: any;
  layersRevit: any;
  imageopen: any;
  mediatype: any;
  mediasrcpaths: any;
  mediaSelectedscale: any;
  mediatimestamp: any;
  updateContractPackage: any;
  updateNewTimeSliderparam: any;
  updateChartPanelwidth: any;
  updateLayersRevit: any;
  updateImageOpen: any;
  updateMediatype: any;
  updateMediasrcpaths: any;
  updateMediaSelectedscale: any;
  updateMediatimestamp: any;
};

const initialState = {
  contractpackages: undefined,
  newTimeSliderparam: undefined,
  chartPanelwidth: undefined,
  layersRevit: undefined,
  imageopen: undefined,
  mediatype: undefined,
  mediasrcpaths: undefined,
  mediaSelectedscale: undefined,
  mediatimestamp: undefined,
  updateContractPackage: undefined,
  updateNewTimeSliderparam: undefined,
  updateChartPanelwidth: undefined,
  updateLayersRevit: undefined,
  updateImageOpen: undefined,
  updateMediatype: undefined,
  updateMediasrcpaths: undefined,
  updateMediaSelectedscale: undefined,
  updateMediatimestamp: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
