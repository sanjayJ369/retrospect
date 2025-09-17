"use client";
import HomeNavbar from "../components/home-navbar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/8bit/dialog";
import { Button } from "@/components/ui/8bit/button";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const DONT_SHOW_KEY = "retro.unauth_warning.dismissed";

const HomeLayout = ({ children }: HomeLayoutProps) => {
  const { isAuthorized } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(DONT_SHOW_KEY) === "1";
    if (!isAuthorized && !dismissed) {
      setOpen(true);
    }
  }, [isAuthorized]);

  const handleDontShow = () => {
    window.localStorage.setItem(DONT_SHOW_KEY, "1");
    setOpen(false);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <HomeNavbar />
      <main className="flex-1">{children}</main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limited mode</DialogTitle>
            <DialogDescription>
              You are using Retrospect without an account. Your data is stored
              locally in your browser. Sign in to sync across devices and unlock
              analytics.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button onClick={handleDontShow}>Don&apos;t show again</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeLayout;
