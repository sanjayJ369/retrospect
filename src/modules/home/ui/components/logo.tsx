import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="text-[8px] font-bold sm:text-sm md:text-xl">
      <div className="flex gap-1 items-center justify-center">
        <Image src="/images/logo.png" alt="logo" width={32} height={32} />
        <p className="hidden sm:block">RETROSPECT</p>
      </div>
    </Link>
  );
};
