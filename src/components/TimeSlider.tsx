import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import {
  stFoundationLayer,
  piersLayer,
  bearingsLayer,
  specialtyEquipmentLayer,
  decksLayer,
  stFramingLayer,
} from "../layers";
import { layersTimeSliderReset } from "../Query";
import { primaryLabelColor, timeSliderParameters } from "../uniqueValues";
import "@arcgis/map-components/components/arcgis-time-slider";
import { MyContext } from "../contexts/MyContext";
import { use } from "react";
import type { ArcgisTimeSlider } from "@arcgis/map-components/components/arcgis-time-slider";

export default function TimeSlider() {
  const { updateNewTimeSliderparam } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");

  arcgisScene?.viewOnReady(() => {
    const timeSlider: any = document.querySelector(
      "arcgis-time-slider",
    ) as ArcgisTimeSlider;

    const start = new Date(2024, 1, 1);
    timeSlider.fullTimeExtent = {
      start: start,
      end: new Date(2026, 2, 15),
    };
    timeSlider.stops = {
      interval: {
        value: 1,
        unit: "months",
      },
      // dates: //
      // count: 50,
    };

    reactiveUtils.watch(
      () => timeSlider?.timeExtent,
      (timeExtent) => {
        if (timeExtent) {
          // console.log(timeExtent.end.getTime());
          const year = timeExtent.end.getFullYear();
          const month = timeExtent.end.getMonth() + 1;
          const day = timeExtent.end.getDate();
          const new_date = `${year}-${month}-${day}`;

          // Filter
          // "DocUpdate" will be newTimeSliderparam
          layersTimeSliderReset(stFoundationLayer, "DocUpdate", new_date);
          layersTimeSliderReset(piersLayer, "DocUpdate", new_date);
          layersTimeSliderReset(bearingsLayer, "DocUpdate", new_date);
          layersTimeSliderReset(specialtyEquipmentLayer, "DocUpdate", new_date);
          layersTimeSliderReset(decksLayer, "DocUpdate", new_date);
          layersTimeSliderReset(stFramingLayer, "DocUpdate", new_date);
        }
      },
    );
  });

  return (
    <>
      <div>
        <calcite-select
          label=""
          style={{ "--calcite-select-text-color": primaryLabelColor }}
          oncalciteSelectChange={(event: any) =>
            updateNewTimeSliderparam(event.srcElement.value)
          }
        >
          {timeSliderParameters.map((param: any, index: any) => {
            return (
              <calcite-option key={index} value={param}>
                {param}
              </calcite-option>
            );
          })}
        </calcite-select>

        <arcgis-time-slider
          referenceElement="arcgis-scene"
          slot="bottom-right"
          layout="auto"
          mode="cumulative-from-start"
        ></arcgis-time-slider>
      </div>
    </>
  );
}
