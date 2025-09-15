import { ModeToggle } from "@/components/theme-toggle";
import Container from "@/components/ui/8bit/container";
import HomeSidebar from "./home-sidebar";
import Link from "next/link";
import { SoundToggle } from "@/components/sound-toggle";
import Image from "next/image";
import { useAuth } from "@/context/auth-provider";
import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import { User } from "lucide-react";

const HomeNavbar = () => {
  const { isAuthorized, user, logout } = useAuth();

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
          <DropdownMenu>
            <Container>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {isAuthorized && user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/signin">Log in</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </Container>
          </DropdownMenu>
          <ModeToggle />
          <SoundToggle />
        </div>
      </Container>
    </div>
  );
};

export default HomeNavbar;
