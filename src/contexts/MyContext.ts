import { createContext } from "react";

type MyDropdownContextType = {
  contractpackages: any;
  newTimeSliderparam: any;
  chartPanelwidth: any;
  layersRevit: any;
  updateContractPackage: any;
  updateNewTimeSliderparam: any;
  updateChartPanelwidth: any;
  updateLayersRevit: any;
};

const initialState = {
  contractpackages: undefined,
  newTimeSliderparam: undefined,
  chartPanelwidth: undefined,
  layersRevit: undefined,
  updateContractPackage: undefined,
  updateNewTimeSliderparam: undefined,
  updateChartPanelwidth: undefined,
  updateLayersRevit: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
