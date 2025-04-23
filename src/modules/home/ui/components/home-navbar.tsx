import { ModeToggle } from "@/components/theme-toggle";
import Container from "@/components/ui/8bit/container";
import HomeSidebar from "./home-sidebar";
import Link from "next/link";

const HomeNavbar = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Container className="w-4/5 -mt-2 relative flex justify-between items-center p-6">
        <HomeSidebar />
        <Link
          href={"/"}
          className="absolute left-1/2 -translate-x-1/2 font-bold m-auto"
        >
          RETROSPECT
        </Link>
        <ModeToggle />
      </Container>
    </div>
  );
};

export default HomeNavbar;
