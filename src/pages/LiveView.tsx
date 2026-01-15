const LiveView = () => {
  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-semibold mb-4">Live View</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((cam) => (
          <div
            key={cam}
            className="aspect-video bg-black rounded-lg flex items-center justify-center text-white"
          >
            Camera {cam}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveView;
