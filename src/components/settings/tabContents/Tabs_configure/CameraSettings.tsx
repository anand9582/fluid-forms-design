interface Props {
  cameraId: string;
}

export default function CameraSettings({ cameraId }: Props) {
  return <div>Settings for {cameraId}</div>;
}
