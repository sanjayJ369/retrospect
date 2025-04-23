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
} from "lucide-react";
import { Button } from "@/components/ui/8bit/button";
import Link from "next/link";

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
  ];

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle className="text-xl">Navigation</SheetTitle>
          <Separator />
          {routes.map((route) => (
            <Link key={route.key} href={route.href} legacyBehavior>
              <Button className="m-2">
                <SheetTitle className="w-full flex justify-between items-center">
                  <route.Icon />
                  {route.title}
                </SheetTitle>
              </Button>
            </Link>
          ))}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default HomeSidebar;
