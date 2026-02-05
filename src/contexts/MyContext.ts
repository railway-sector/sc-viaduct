import { createContext } from "react";

type MyDropdownContextType = {
  contractpackages: any;
  updateContractPackage: any;
};

const initialState = {
  contractpackages: undefined,
  updateContractPackage: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
