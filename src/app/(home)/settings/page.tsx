"use client";
import { useAuth } from "@/context/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import Link from "next/link";

const SettingsPage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to view settings.</p>
            <Button asChild className="mt-4">
              <Link href="/auth/signin">Log in</Link>
            </Button>
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
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <p className="text-sm text-muted-foreground">{user.timezone || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email Verified</label>
            <p className="text-sm text-muted-foreground">
              {user.is_verified ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" asChild>
              <Link href="/auth/forgot-password">Change Password</Link>
            </Button>
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