import { use } from "react";
import "../index.css";
import "@esri/calcite-components/components/calcite-segmented-control";
import "@esri/calcite-components/components/calcite-segmented-control-item";
import { cpackages } from "../uniqueValues";
import { PackageContext } from "../contexts/PackageContext";
import { TsParamContext } from "../contexts/TsParamContext";

export default function StationSegmentedList() {
  const { updateCpackage, cpackage } = use(PackageContext);
  const { updateNewTsparam } = use(TsParamContext);

  return (
    <>
      <calcite-segmented-control
        oncalciteSegmentedControlChange={(event: any) => {
          updateCpackage(event.target.selectedItem.id);
          updateNewTsparam("Planned Completion Date");
        }}
        scale="m"
        width="full"
        style={{ width: "480px", marginRight: "200px" }}
      >
        {cpackage &&
          cpackages.map((contractp: any, index: any) => {
            return (
              <calcite-segmented-control-item
                {...(cpackage === contractp ? { checked: true } : {})}
                key={index}
                value={contractp}
                id={contractp}
              >
                {contractp}
              </calcite-segmented-control-item>
            );
          })}
      </calcite-segmented-control>
    </>
  );
}
