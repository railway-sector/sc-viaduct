import { watch } from "@arcgis/core/core/reactiveUtils.js";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import { sublayers_all, viaductLayer } from "../layers";
import { layersTimeSliderReset, yearMonthDay } from "../query";
import { cp_with_revit, primaryLabelColor, ts_field_q } from "../uniqueValues";
import "@arcgis/map-components/components/arcgis-time-bar";
import "@arcgis/map-components/components/arcgis-time-bar-slider";
import { use, useEffect, useMemo } from "react";
import { PackageContext } from "../contexts/PackageContext";
import { TsParamContext } from "../contexts/TsParamContext";
import TimeExtent from "@arcgis/core/time/TimeExtent";
import TimeInterval from "@arcgis/core/time/TimeInterval.js";

export default function TimeSlider() {
  const { cpackage } = use(PackageContext);
  const { updateNewTsparam, newTsparam } = use(TsParamContext);

  const arcgisScene = document.querySelector("arcgis-scene");
  const timeBar: any = document.querySelector("arcgis-time-bar");

  //--- TimeExtent
  const timeExtent = new TimeExtent({
    start: new Date(2024, 1, 1),
    end: new Date(2029, 6, 15),
  });

  //-------------------------------------------//
  //   Reset when date parameter is changed    //
  //-------------------------------------------//
  useEffect(() => {
    if (!timeBar) return;
    timeBar.timeExtent = new TimeExtent({
      start: timeExtent.start,
      end: timeExtent.start,
    });
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
    arcgisScene?.viewOnReady(() => {
      const timeBar: any = document.querySelector("arcgis-time-bar");
      timeBar.fullTimeExtent = new TimeExtent({
        start: timeExtent.start,
        end: timeExtent.end,
      });
      timeBar.stops = {
        interval: new TimeInterval({ value: 1, unit: "months" }),
      };

      watch(
        () => timeBar?.timeExtent,
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
  }, [newTsparam, newDateField, cpackage]);

  return (
    <div
      style={{
        bottom: "1.5%",
        left: "5%",
        position: "fixed",
        zIndex: 1,
        width: "60%",
      }}
    >
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

      <arcgis-time-bar
        referenceElement="arcgis-scene"
        slot="bottom-left"
        mode="cumulative-from-start"
        show-next
        show-play
        show-previous
        show-time-extent
      >
        <arcgis-time-bar-slider
          slot="time-extent"
          show-min
          show-max
          show-thumb-labels
          show-ticks
          popover-display="always"
        ></arcgis-time-bar-slider>
      </arcgis-time-bar>
    </div>
  );
}
