import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/8bit/sheet";
import {
  BarChart2Icon,
  CalendarCheckIcon,
  CheckSquareIcon,
  MenuIcon,
  ZapIcon,
  UserIcon, // Import from lucide-react
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import { NavButton } from "@/components/ui/8bit/nav-button";

interface Route {
  key: string;
  title: string;
  href: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const HomeSidebar = () => {
  const routes: Route[] = [
    {
      key: "tasks",
      title: "TASKS",
      href: "/tasks",
      Icon: CheckSquareIcon,
    },
    {
      key: "challenges",
      title: "CHALLENGES",
      href: "/challenges",
      Icon: ZapIcon,
    },
    {
      key: "calendar",
      title: "CALENDAR",
      href: "/calendar",
      Icon: CalendarCheckIcon,
    },
    {
      key: "analytics",
      title: "ANALYTICS",
      href: "/analytics",
      Icon: BarChart2Icon,
    },
    {
      key: "signin",
      title: "SIGN IN",
      href: "/signin",
      Icon: UserIcon, // Import from lucide-react
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle className="text-sm sm:text-md md:text-xl">
            Navigation
          </SheetTitle>
          <Separator />
          {routes.map((route) => (
            <NavButton
              className="flex m-3 justify-between"
              key={route.key}
              variant="outline"
              href={route.href}
            >
              <route.Icon />
              {route.title}
            </NavButton>
          ))}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default HomeSidebar;
