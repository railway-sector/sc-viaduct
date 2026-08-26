import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import { sublayers_all, viaductLayer } from "../layers";
import { layersTimeSliderReset, yearMonthDay } from "../query";
import { cp_with_revit, primaryLabelColor, ts_field_q } from "../uniqueValues";
import "@arcgis/map-components/components/arcgis-time-slider";
import { MyContext } from "../contexts/MyContext";
import { use, useEffect, useMemo } from "react";

export default function TimeSlider() {
  const { updateNewTsparam, newTsparam, cpackage } = use(MyContext);
  const arcgisScene = document.querySelector("arcgis-scene");
  const timeSlider: any = document.querySelector("arcgis-time-slider");

  //--- TimeExtent
  const timeExtent = {
    start: new Date(2024, 1, 1),
    end: new Date(2029, 6, 15),
  };

  //-------------------------------------------//
  //   Reset when date parameter is changed    //
  //-------------------------------------------//
  useEffect(() => {
    if (!timeSlider) return;
    timeSlider.timeExtent = { start: timeExtent.start, end: timeExtent.start };
  }, [newTsparam]);

  //-------------------------------------------//
  //          New selected date field          //
  //-------------------------------------------//
  // Recompute only when a new date parameter is selected (else use the cached)
  const newDateField = useMemo(
    () => ts_field_q?.find((f: any) => f.datename === newTsparam)?.datefield,
    [newTsparam],
  );

  useEffect(() => {
    let watchHandle: any;
    let cancelled = false;

    arcgisScene?.viewOnReady(() => {
      if (cancelled) return; // don't attach if this effect already got cleaned up

      const timeSlider: any = document.querySelector("arcgis-time-slider");
      timeSlider.fullTimeExtent = {
        start: timeExtent.start,
        end: timeExtent.end,
      };
      timeSlider.stops = { interval: { value: 1, unit: "months" } };

      watchHandle = reactiveUtils.watch(
        () => timeSlider?.timeExtent,
        (timeExtent) => {
          if (!timeExtent) return;
          const { year, month, day } = yearMonthDay(timeExtent.end);
          const new_date = `${year}-${month}-${day}`;

          layersTimeSliderReset({
            layers: [viaductLayer],
            field_name: newDateField,
            new_date,
            contractcp: cpackage,
          });

          if (cp_with_revit.includes(cpackage)) {
            layersTimeSliderReset({
              layers: sublayers_all[cpackage].map((l: any) => l.layer),
              field_name: newDateField,
              new_date,
              contractcp: cpackage,
            });
          }
        },
      );
    });

    return () => {
      cancelled = true;
      watchHandle?.remove(); // clean up old watch handle
    };
  }, [newTsparam, newDateField, cpackage]);

  return (
    <>
      <div>
        <calcite-select
          label=""
          style={{ "--calcite-select-text-color": primaryLabelColor }}
          oncalciteSelectChange={(event: any) =>
            updateNewTsparam(event.srcElement.value)
          }
        >
          {ts_field_q.map((p: any, index: any) => {
            return (
              <calcite-option
                key={index}
                value={p.datename}
                selected={p.datename === newTsparam}
              >
                {p.datename}
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
