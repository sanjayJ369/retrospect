import { ModeToggle } from "@/components/theme-toggle";
import Container from "@/components/ui/8bit/container";
import HomeSidebar from "./home-sidebar";
import Link from "next/link";
import { SoundToggle } from "@/components/sound-toggle";

const HomeNavbar = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Container
        className="sm:w-full lg:w-4/5 -mt-2 relative flex flex-col sm:flex-row justify-between
          items-center p-4 sm:p-6"
      >
        <HomeSidebar />
        <Link
          href={"/"}
          className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 font-bold m-auto text-center
            sm:text-left"
        >
          RETROSPECT
        </Link>
        <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-0">
          <ModeToggle />
          <SoundToggle />
        </div>
      </Container>
    </div>
  );
};

export default HomeNavbar;
