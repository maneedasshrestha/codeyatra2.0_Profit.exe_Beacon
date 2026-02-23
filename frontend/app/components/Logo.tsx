import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/assets/beacon-logo1.png"
      alt="Beacon"
      width={450}
      height={450}
      className="object-contain"
      priority
    />
  );
}
