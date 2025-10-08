import { ModeToggle } from "@/components/theme-toggle";
import HomeSidebar from "./home-sidebar";
import { SoundToggle } from "@/components/sound-toggle";
import BaseThemeSelector from "@/components/base-theme-selector";
import { Logo } from "./logo";
import { UserProfileButton } from "./user-profile-button";
import Container from "@/components/ui/8bit/container";

const HomeNavbar = () => {
  return (
    <div className="relative flex justify-center items-center">
      <Container className="p-2 w-9/10">
        <header className="w-full h-14 px-4 border-b p-2">
          <div className="container mx-auto h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HomeSidebar />
              <BaseThemeSelector />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo />
            </div>

            <div className="flex items-center gap-2">
              <UserProfileButton />
              <ModeToggle />
              <SoundToggle />
            </div>
          </div>
        </header>
      </Container>
    </div>
  );
};

export default HomeNavbar;
