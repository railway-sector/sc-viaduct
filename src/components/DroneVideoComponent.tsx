import { use, useEffect, useRef } from "react";
import { MyContext } from "../contexts/MyContext";
import "@esri/calcite-components/components/calcite-card";
import { img_size } from "../uniqueValues";
import { useQuery } from "@tanstack/react-query";
import { mediaTimestampToDates } from "../query";

export default function DroneVideoComponent() {
  const { mediapaths, mediascale, mediatimestamp } = use(MyContext);

  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);

  const { data } = useQuery<any>({
    queryKey: [mediatimestamp],
    queryFn: () => mediaTimestampToDates(mediatimestamp),
    staleTime: Infinity,
  });
  const { yyyy1 = "", yyyy2 = "", mm1 = "", mm2 = "" } = data ?? {};

  // Reset video when played before:
  useEffect(() => {
    [v1Ref.current, v2Ref.current].forEach((video: any) => {
      if (!video) return;
      video.load();
      video.currentTime = 0;
    });
  }, [mediapaths]);

  return (
    <>
      {/* First video:  */}
      <div
        style={{
          width: img_size * mediascale,
          display: mediapaths && mediapaths[0] ? "block" : "none",
          height: "25%",
          backgroundColor: "#2b2b2b",
          padding: "5px",
        }}
      >
        <a href={mediapaths && mediapaths[0]} target="_blank">
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
          ref={v1Ref}
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
          <source src={mediapaths && mediapaths[0]} type="video/mp4"></source>
        </video>
      </div>

      {/* Second video:  */}
      <div
        style={{
          width: img_size * mediascale,
          display: mediapaths && mediapaths[1] ? "block" : "none",
          height: "25%",
          backgroundColor: "#2b2b2b",
          padding: "5px",
        }}
      >
        <a href={mediapaths && mediapaths[1]} target="_blank">
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
          ref={v2Ref}
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
          <source src={mediapaths && mediapaths[1]} type="video/mp4"></source>
        </video>
      </div>
    </>
  );
}
