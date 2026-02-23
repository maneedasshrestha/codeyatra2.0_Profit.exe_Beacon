const BackgroundGlowBlobs = () => {
  return (
    <>
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-85 h-85 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-15 -right-10 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[40%] -left-12.5 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,181,253,0.18) 0%, transparent 70%)",
        }}
      />
    </>
  );
};

export default BackgroundGlowBlobs;
