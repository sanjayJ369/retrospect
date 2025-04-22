import { ModeToggle } from "@/components/theme-toggle";
import Container from "@/components/ui/8bit/container";

const HomeNavbar = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <Container className="w-4/5 -mt-2 flex justify-between items-center p-6">
        <p className="font-bold">RETROSPECT</p>
        <ModeToggle />
      </Container>
    </div>
  );
};

export default HomeNavbar;
