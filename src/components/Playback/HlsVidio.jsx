import { useRef, useEffect } from "react";
import Hls from "hls.js";

export function HlsVidio({ src }) {   // <-- remove ": { src: string }"
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => video.play().catch(() => (video.muted = true));

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      playVideo();
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
      return () => hls.destroy();
    }
  }, [src]);

  return <video ref={videoRef} controls muted style={{ width: "100%", height: "100%" }} />;
}