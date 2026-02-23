const BackgroundGlowBlobs = () => (
  <>
    <div
      className="pointer-events-none fixed -top-20 -left-15 w-64 h-64 rounded-full opacity-40"
      style={{
        background: "radial-gradient(circle,#c084fc55,transparent 70%)",
        zIndex: 0,
      }}
    />
    <div
      className="pointer-events-none fixed bottom-24 -right-12.5 w-52 h-52 rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle,#818cf855,transparent 70%)",
        zIndex: 0,
      }}
    />
  </>
);

export default BackgroundGlowBlobs;
