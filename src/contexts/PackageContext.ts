// contexts/PackageContext.ts
import { createContext } from "react";

type PackageContextType = {
  cpackage: any;
  updateCpackage: any;
};

export const PackageContext = createContext<PackageContextType>({
  cpackage: undefined,
  updateCpackage: undefined,
});
