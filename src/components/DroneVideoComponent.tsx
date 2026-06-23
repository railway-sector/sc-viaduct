import { use, useEffect } from "react";
import { MyContext } from "../contexts/MyContext";
import "@esri/calcite-components/components/calcite-card";
import { img_size } from "../uniqueValues";
import { useQuery } from "@tanstack/react-query";
import { mediaTimestampToDates } from "../query";

export default function DroneVideoComponent() {
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
  });
  const yyyy1 = data?.yyyy1 || "";
  const yyyy2 = data?.yyyy2 || "";
  const mm1 = data?.mm1 || "";
  const mm2 = data?.mm2 || "";

  // const videoRef = useRef(null);
  const video1 = document.getElementById("videoPlayer1") as HTMLVideoElement;
  const video2 = document.getElementById("videoPlayer2") as HTMLVideoElement;

  // Reset video when played before:
  useEffect(() => {
    video2 && video2.load();
    video1 && video1.load();

    video1 ? (video1.currentTime = 0) : null;
    video2 ? (video2.currentTime = 0) : null;
  }, [mediasrcpaths]);

  ///////////////////////////////////////////////
  return (
    <>
      {/* First video:  */}
      <div
        style={{
          width: img_size * mediaSelectedscale,
          display: mediasrcpaths && mediasrcpaths[0] ? "block" : "none",
          height: "25%",
          backgroundColor: "#2b2b2b",
          padding: "5px",
        }}
      >
        <a href={mediasrcpaths && mediasrcpaths[0]} target="_blank">
          <span
            style={{
              color: "white",
              fontSize: "14px",
            }}
          >
            Video 1: {yyyy1} {mm1}
          </span>
        </a>
        <video
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }} //'contain', 'cover', 'fill', 'none', 'scale-down'
          id="videoPlayer1"
          // playsInline
          controls
          autoPlay
          muted
        >
          <source
            src={mediasrcpaths && mediasrcpaths[0]}
            type="video/mp4"
          ></source>
        </video>
      </div>

      {/* Second video:  */}
      <div
        style={{
          width: img_size * mediaSelectedscale,
          display: mediasrcpaths && mediasrcpaths[1] ? "block" : "none",
          height: "25%",
          backgroundColor: "#2b2b2b",
          padding: "5px",
        }}
      >
        <a href={mediasrcpaths && mediasrcpaths[1]} target="_blank">
          <span
            style={{
              color: "white",
              fontSize: "14px",
            }}
          >
            Video 2: {yyyy2} {mm2}
          </span>
        </a>
        <video
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
          }}
          id="videoPlayer2"
          // playsInline
          controls
          autoPlay
          muted
        >
          <source
            src={mediasrcpaths && mediasrcpaths[1]}
            type="video/mp4"
          ></source>
        </video>
      </div>
    </>
  );
}
