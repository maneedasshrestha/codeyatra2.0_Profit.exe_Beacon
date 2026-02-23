import Logo from "./components/Logo";
import Headline from "./components/Headline";
import FeaturePills from "./components/FeaturePills";
import CTAs from "./components/CTAs";
import BackgroundGlowBlobs from "./components/BackgroundGlowBlobs";

export default function EntryPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 55%, #faf5ff 100%)",
      }}
    >
      <BackgroundGlowBlobs />
      <div className="relative z-10 w-full max-w-103 mx-auto flex flex-col items-center px-6 pt-16 pb-10 min-h-screen justify-between">
        <div className="flex flex-col items-center gap-6 w-full">
          <Logo />
          <Headline />
          <FeaturePills />
        </div>
        <CTAs />
      </div>
    </div>
  );
}
