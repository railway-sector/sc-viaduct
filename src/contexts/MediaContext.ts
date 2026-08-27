// contexts/MediaContext.ts
import { createContext } from "react";

type MediaContextType = {
  mediaopen: any;
  mediatype: any;
  mediapaths: any;
  mediascale: any;
  mediatimestamp: any;
  updateMediaopen: any;
  updateMediatype: any;
  updateMediapaths: any;
  updateMediascale: any;
  updateMediatimestamp: any;
};

export const MediaContext = createContext<MediaContextType>({
  mediaopen: undefined,
  mediatype: undefined,
  mediapaths: undefined,
  mediascale: undefined,
  mediatimestamp: undefined,
  updateMediaopen: undefined,
  updateMediatype: undefined,
  updateMediapaths: undefined,
  updateMediascale: undefined,
  updateMediatimestamp: undefined,
});
