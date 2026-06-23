import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import { viaductLayer } from "../layers";
import { layersTimeSliderReset } from "../query";
import {
  primaryLabelColor,
  timeSliderDatesNames,
  timeSliderParameters,
} from "../uniqueValues";
import "@arcgis/map-components/components/arcgis-time-slider";
import { MyContext } from "../contexts/MyContext";
import { use, useEffect } from "react";

export default function TimeSlider() {
  const { updateNewTimeSliderparam, newTimeSliderparam, cpackage } =
    use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");
  const timeSlider: any = document.querySelector("arcgis-time-slider");

  //--- TimeExtent
  const timeExtent = {
    start: new Date(2024, 1, 1),
    end: new Date(2029, 6, 15),
  };

  //--- New date field using a selected param
  const newDateField = timeSliderDatesNames?.find(
    (item: any) => item.datename === newTimeSliderparam,
  ).datefield;

  //--- Reset when date parameter is changed
  useEffect(() => {
    if (timeSlider) {
      timeSlider.timeExtent = {
        start: timeExtent.start,
        end: timeExtent.start,
      };
    }
  }, [newTimeSliderparam]);

  arcgisScene?.viewOnReady(() => {
    const timeSlider: any = document.querySelector("arcgis-time-slider");

    timeSlider.fullTimeExtent = {
      start: timeExtent.start,
      end: timeExtent.end,
    };

    timeSlider.stops = {
      interval: {
        value: 1,
        unit: "months",
      },
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

          //--- scenelayer
          layersTimeSliderReset({
            layer: viaductLayer,
            field_name: newDateField,
            new_date: new_date,
            contractcp: cpackage,
          });

          //--- building scene layer
          // s01Sublayers.map((sublayer: any) => {
          //   layersTimeSliderReset({
          //     layer: sublayer.layer,
          //     field_name: "last_edited_date",
          //     new_date: new_date,
          //     contractcp: cpackage,
          //   });
          // });
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
