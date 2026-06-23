import { createContext } from "react";

type MyDropdownContextType = {
  cpackage: any;
  newTimeSliderparam: any;
  layersRevit: any;
  imageopen: any;
  mediatype: any;
  mediasrcpaths: any;
  mediaSelectedscale: any;
  mediatimestamp: any;
  updateCpackage: any;
  updateNewTimeSliderparam: any;
  updateLayersRevit: any;
  updateImageOpen: any;
  updateMediatype: any;
  updateMediasrcpaths: any;
  updateMediaSelectedscale: any;
  updateMediatimestamp: any;
};

const initialState = {
  cpackage: undefined,
  newTimeSliderparam: undefined,
  layersRevit: undefined,
  imageopen: undefined,
  mediatype: undefined,
  mediasrcpaths: undefined,
  mediaSelectedscale: undefined,
  mediatimestamp: undefined,
  updateCpackage: undefined,
  updateNewTimeSliderparam: undefined,
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
