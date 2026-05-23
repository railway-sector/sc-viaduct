import { use, useState, useEffect } from "react";
import { MyContext } from "../contexts/MyContext";
import "@esri/calcite-components/components/calcite-card";
import { img_size, months } from "../uniqueValues";

export default function DroneImageComponent() {
  const { mediasrcpaths, mediaSelectedscale, mediatimestamp } = use(MyContext);

  const [yyyy1, setYyyy1] = useState<string>();
  const [yyyy2, setYyyy2] = useState<string>();
  const [mm1, setMm1] = useState<string>();
  const [mm2, setMm2] = useState<string>();

  useEffect(() => {
    if (mediatimestamp) {
      setYyyy1(mediatimestamp[0].toString().slice(0, 4));
      setYyyy2(mediatimestamp[1].toString().slice(0, 4));
      setMm1(months[Number(mediatimestamp[0].toString().slice(4, 6)) - 1]);
      setMm2(months[Number(mediatimestamp[1].toString().slice(4, 6)) - 1]);
    }
  }, [mediatimestamp]);

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
