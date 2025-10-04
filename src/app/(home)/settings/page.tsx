"use client";

import { useAuth } from "@/context/auth-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { useEffect, useState } from "react";
import Link from "next/link";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to view settings.</p>
            <div className="mt-3">
              <Link href="/auth/signin" passHref>
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <p id="name" className="text-sm text-muted-foreground">
              {user.name}
            </p>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <p id="email" className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
          <div>
            <label htmlFor="timezone" className="text-sm font-medium">
              Timezone
            </label>
            <p id="timezone" className="text-sm text-muted-foreground">
              {user.timezone || "Not set"}
            </p>
          </div>
          <div>
            <label htmlFor="verified" className="text-sm font-medium">
              Email Verified
            </label>
            <p id="verified" className="text-sm text-muted-foreground">
              {user.is_verified ? "Yes" : "No"}
            </p>
          </div>
          <div className="pt-4">
            <Link href="/auth/forgot-password" passHref>
              <Button variant="outline">Change Password</Button>
            </Link>
          </div>
          <div className="pt-4">
            <Button variant="destructive" onClick={logout}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
