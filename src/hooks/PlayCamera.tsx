import { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { APISERVERURL, API_URLS } from "@/components/Config/api";
import { useStreamStore , CameraStream } from "@/Store/useStreamStore";

export const usePlayCamera = (addDebugLog: (msg: string) => void) => {
  const {
    streams,
    addStream,
    removeStreamByInstanceId,
    removeStreamsBySlotId,
  } = useStreamStore();

  const allPeerConnections = useRef<RTCPeerConnection[]>([]);

  // ------------------------------
  // Global active RTC map (debug / safety)
  // ------------------------------
  const activeConnections: Record<string, Set<string>> =
    (window as any).__activeRtcMap__ || {};
  (window as any).__activeRtcMap__ = activeConnections;

  const logActiveConnections = useCallback(() => {
     const list =
     streams.map((s) => `${s.cameraId}-${s.streamType}`).join(", ") || "None";
     addDebugLog(`Active RTC Connections: ${list}`);
  }, [streams, addDebugLog]);

  // ------------------------------
  // PLAY FUNCTION
  // ------------------------------
  const play = useCallback(
    (
      cameraId: string,
      videoElement: HTMLVideoElement,
      type: "main" | "sub" = "sub",
      slotId?: number
    ) => {
      if (!cameraId || !videoElement)
        return { pc: null, instanceId: null };

      const key = `${cameraId}_${type}`;
      const instanceId = uuidv4();

      if (!activeConnections[key]) activeConnections[key] = new Set();
      activeConnections[key].add(instanceId);

      const parent = videoElement.parentElement;

      let loadingDiv = parent?.querySelector(
        ".loading-spinner"
      ) as HTMLElement;

     if (!loadingDiv && parent) {
          loadingDiv = document.createElement("div");
          loadingDiv.className =
            "loading-spinner absolute inset-0 flex flex-col items-center justify-center  z-10";

          loadingDiv.innerHTML = `
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 border-t-transparent mb-2"></div>
            <div class="loading-text text-blue-500 text-sm">Trying to connect...</div>
          `;

          parent.appendChild(loadingDiv);
        }

      if (loadingDiv) loadingDiv.style.display = "flex";

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      allPeerConnections.current.push(pc);

      pc.ontrack = (event) => {
        videoElement.srcObject = event.streams[0];

        const onCanPlay = () => {
          if (loadingDiv) loadingDiv.style.display = "none";
          videoElement.removeEventListener("canplay", onCanPlay);
        };

        videoElement.addEventListener("canplay", onCanPlay);
        videoElement.play().catch(() => {});
      };

      pc.onconnectionstatechange = () =>
        addDebugLog(
          `${cameraId}-${type} connectionState: ${pc.connectionState}`
        );

      pc.oniceconnectionstatechange = () =>
        addDebugLog(
          `${cameraId}-${type} iceState: ${pc.iceConnectionState}`
        );

      try {
        pc.addTransceiver("video", { direction: "recvonly" });
      } catch {}
      try {
        pc.addTransceiver("audio", { direction: "recvonly" });
      } catch {}
      try {
        pc.createDataChannel("keepalive");
      } catch {}

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() =>
          fetch(
            `${APISERVERURL}${API_URLS.Liveview}${cameraId}?type=${type}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/sdp" },
              body: pc.localDescription?.sdp,
            }
          )
        )
        .then((res) => {
          if (!res.ok)
            throw new Error(`WHEP proxy error ${res.status}`);
          return res.text();
        })
        .then((answerSdp) =>
          pc.setRemoteDescription({ type: "answer", sdp: answerSdp })
        )
        .then(() => {
          const newStream: CameraStream = {
            instanceId,
            cameraId,
            pc,
            streamType: type,
            slotId,
          };

          addStream(newStream);

          addDebugLog(
            ` Stream added [${cameraId}] (${type}) -> ${instanceId}`
          );
          logActiveConnections();
        })
        .catch((err) => {
          addDebugLog(
            `play() failed for ${cameraId} | ${err?.message || err}`
          );

          try {
            pc.close();
          } catch {}

          allPeerConnections.current =
            allPeerConnections.current.filter((p) => p !== pc);

          if (loadingDiv) loadingDiv.style.display = "none";
          activeConnections[key]?.delete(instanceId);
        });

      return { pc, instanceId };
    },
    [streams, addStream, addDebugLog, logActiveConnections]
  );

  // ------------------------------
  // CLOSE SINGLE CONNECTION
  // ------------------------------
  const closeConnection = useCallback(
    (instanceId: string) => {
      const stream = streams.find((s) => s.instanceId === instanceId);
      if (!stream) return null;

      const { pc, cameraId, streamType } = stream;
      const key = `${cameraId}_${streamType}`;

      try {
        pc.getSenders().forEach((s) => s.track?.stop());
      } catch {}
      try {
        pc.close();
      } catch {}

      removeStreamByInstanceId(instanceId);

      addDebugLog(
        `RTC Closed — ${cameraId} (${streamType}) instance=${instanceId}`
      );

      allPeerConnections.current =
        allPeerConnections.current.filter((p) => p !== pc);

      if (activeConnections[key]) {
        activeConnections[key].delete(instanceId);
        if (activeConnections[key].size === 0) delete activeConnections[key];
      }

      logActiveConnections();
      return cameraId;
    },
    [streams, removeStreamByInstanceId, addDebugLog, logActiveConnections]
  );

  // ------------------------------
  // CLOSE SLOT CONNECTIONS
  // ------------------------------
  const closeSlotConnections = useCallback(
    (slotId: number) => {
      const slotStreams = streams.filter((s) => s.slotId === slotId);
      const removedCameraIds: string[] = [];

      slotStreams.forEach((s) => {
        const cam = closeConnection(s.instanceId);
        if (cam) removedCameraIds.push(cam);
      });

      removeStreamsBySlotId(slotId);
      addDebugLog(` Closed all connections for slot ${slotId}`);

      return removedCameraIds;
    },
    [streams, closeConnection, removeStreamsBySlotId, addDebugLog]
  );

  const getActiveConnectionCount = useCallback(
    () => streams.length,
    [streams]
  );

  return {
    play,
    closeConnection,
    closeSlotConnections,
    getActiveConnectionCount,
    _internal: { allPeerConnections },
  };
};
