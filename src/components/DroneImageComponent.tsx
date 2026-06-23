import { use } from "react";
import { MyContext } from "../contexts/MyContext";
import "@esri/calcite-components/components/calcite-card";
import { img_size } from "../uniqueValues";
import { useQuery } from "@tanstack/react-query";
import { mediaTimestampToDates } from "../query";

export default function DroneImageComponent() {
  const { mediasrcpaths, mediaSelectedscale, mediatimestamp } = use(MyContext);

  const { data } = useQuery<any>({
    queryKey: [mediatimestamp],
    queryFn: async () => await mediaTimestampToDates(mediatimestamp),
    select: (response) => {
      return {
        yyyy1: response.yyyy1,
        yyyy2: response.yyyy2,
        mm1: response.mm1,
        mm2: response.mm2,
      };
    },
    staleTime: Infinity,
  });
  const yyyy1 = data?.yyyy1 || "";
  const yyyy2 = data?.yyyy2 || "";
  const mm1 = data?.mm1 || "";
  const mm2 = data?.mm2 || "";

  return (
    <>
      {/* First image: */}
      <calcite-card
        style={{
          width: img_size * mediaSelectedscale,
          display: mediasrcpaths && mediasrcpaths[0] ? "block" : "none",
        }}
      >
        <a href={mediasrcpaths && mediasrcpaths[0]} target="_blank">
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
          src={mediasrcpaths && mediasrcpaths[0]}
          alt="Drone image"
          height={img_size * mediaSelectedscale}
          width={img_size * mediaSelectedscale}
          style={{ objectFit: "cover" }}
        />
      </calcite-card>

      {/* Second image: */}
      <calcite-card
        style={{
          width: img_size * mediaSelectedscale,
          display: mediasrcpaths && mediasrcpaths[1] ? "block" : "none",
        }}
      >
        <a href={mediasrcpaths && mediasrcpaths[1]} target="_blank">
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
          src={mediasrcpaths && mediasrcpaths[1]}
          alt="Drone image"
          height={img_size * mediaSelectedscale}
          width={img_size * mediaSelectedscale}
          style={{ objectFit: "cover" }}
          // style={{ margin: "auto" }}
        />
      </calcite-card>
    </>
  );
}
