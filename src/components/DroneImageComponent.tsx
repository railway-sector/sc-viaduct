import { use } from "react";
import { MyContext } from "../contexts/MyContext";
import "@esri/calcite-components/components/calcite-card";
import { img_size } from "../uniqueValues";
import { useQuery } from "@tanstack/react-query";
import { mediaTimestampToDates } from "../query";

export default function DroneImageComponent() {
  const { mediapaths, mediascale, mediatimestamp } = use(MyContext);

  const { data } = useQuery<any>({
    queryKey: [mediatimestamp],
    queryFn: () => mediaTimestampToDates(mediatimestamp),
    staleTime: Infinity,
  });
  const { yyyy1 = "", yyyy2 = "", mm1 = "", mm2 = "" } = data ?? {};

  return (
    <>
      {/* First image: */}
      <calcite-card
        style={{
          width: img_size * mediascale,
          display: mediapaths && mediapaths[0] ? "block" : "none",
        }}
      >
        <a href={mediapaths && mediapaths[0]} target="_blank">
          <span
            style={{
              color: "white",
              fontSize: "14px",
            }}
          >
            Image 1: {yyyy1} {mm1}
          </span>
        </a>
        <img
          src={mediapaths && mediapaths[0]}
          alt="Drone image"
          height={img_size * mediascale}
          width={img_size * mediascale}
          style={{ objectFit: "cover" }}
        />
      </calcite-card>

      {/* Second image: */}
      <calcite-card
        style={{
          width: img_size * mediascale,
          display: mediapaths && mediapaths[1] ? "block" : "none",
        }}
      >
        <a href={mediapaths && mediapaths[1]} target="_blank">
          <span
            style={{
              color: "white",
              fontSize: "14px",
            }}
          >
            Image 2: {yyyy2} {mm2}
          </span>
        </a>
        <img
          src={mediapaths && mediapaths[1]}
          alt="Drone image"
          height={img_size * mediascale}
          width={img_size * mediascale}
          style={{ objectFit: "cover" }}
          // style={{ margin: "auto" }}
        />
      </calcite-card>
    </>
  );
}
