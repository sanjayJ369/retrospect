import { ModeToggle } from "@/components/theme-toggle";
import Container from "@/components/ui/8bit/container";
import HomeSidebar from "./home-sidebar";
import Link from "next/link";
import { SoundToggle } from "@/components/sound-toggle";
import Image from "next/image";

const HomeNavbar = () => {
  return (
    <div className="w-full flex justify-center items-center h-10 sm:h-12 md:h-14">
      <Container className="w-9/10 p-2 relative flex items-center justify-between">
        <div>
          <HomeSidebar />
        </div>
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold
            sm:text-sm md:text-xl"
        >
          <div className="flex gap-1 items-center justify-center">
            <Image src={"/images/logo.png"} alt="logo" width={32} height={32} />
            <p className="hidden sm:block">RETROSPECT</p>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ModeToggle />
          <SoundToggle />
        </div>
      </Container>
    </div>
  );
};

export default HomeNavbar;
