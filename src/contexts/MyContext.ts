import { createContext } from "react";

type MyDropdownContextType = {
  cpackage: any;
  newTsparam: any;
  layersRevit: any;
  mediaopen: any;
  mediatype: any;
  mediapaths: any;
  mediascale: any;
  mediatimestamp: any;
  updateCpackage: any;
  updateNewTsparam: any;
  updateLayersRevit: any;
  updateMediaopen: any;
  updateMediatype: any;
  updateMediapaths: any;
  updateMediascale: any;
  updateMediatimestamp: any;
};

const initialState = {
  cpackage: undefined,
  newTsparam: undefined,
  layersRevit: undefined,
  mediaopen: undefined,
  mediatype: undefined,
  mediapaths: undefined,
  mediascale: undefined,
  mediatimestamp: undefined,
  updateCpackage: undefined,
  updateNewTsparam: undefined,
  updateLayersRevit: undefined,
  updateMediaopen: undefined,
  updateMediatype: undefined,
  updateMediapaths: undefined,
  updateMediascale: undefined,
  updateMediatimestamp: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
