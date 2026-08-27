// contexts/TsParamContext.ts
import { createContext } from "react";

type TsParamContextType = {
  newTsparam: any;
  updateNewTsparam: any;
};

export const TsParamContext = createContext<TsParamContextType>({
  newTsparam: undefined,
  updateNewTsparam: undefined,
});
