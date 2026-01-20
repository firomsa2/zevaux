"use client";
import { signOut } from "@/actions/auth";
import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { notify } from "@/lib/toast";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    notify.auth.logoutSuccess();
    await signOut();

    setLoading(false);
  };

  return (
    <div className="cursor-pointer">
      <form onSubmit={handleLogout}>
        <Button variant="outline" type="submit" disabled={loading}>
          {loading ? "Signing out..." : "Log out"}
          <LogOut />
        </Button>
      </form>
    </div>
  );
};

export default Logout;
