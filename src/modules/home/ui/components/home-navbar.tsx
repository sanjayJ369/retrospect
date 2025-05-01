import { ModeToggle } from "@/components/theme-toggle";
import Container from "@/components/ui/8bit/container";
import HomeSidebar from "./home-sidebar";
import Link from "next/link";
import { SoundToggle } from "@/components/sound-toggle";

const HomeNavbar = () => {
  return (
    <div className="w-full flex justify-center items-center h-10 sm:h-12 md:h-14">
      <Container
        className="w-full sm:w-full lg:w-4/5 -mt-1 sm:-mt-2 relative flex flex-col sm:flex-row
          justify-between items-center p-2 sm:p-4 md:p-6"
      >
        <div className="absolute left-2 sm:static">
          <HomeSidebar />
        </div>
        <Link
          href={"/"}
          className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 font-bold text-sm sm:text-base
            md:text-lg text-center sm:text-left"
        >
          RETROSPECT
        </Link>
        <div className="flex gap-1 sm:gap-2 md:gap-4 mt-2 sm:mt-0">
          <ModeToggle />
          <SoundToggle />
        </div>
      </Container>
    </div>
  );
};

export default HomeNavbar;
