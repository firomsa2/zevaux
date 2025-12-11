"use client";
import { signOut } from "@/actions/auth";
import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    await signOut();

    setLoading(false);
  };

  return (
    <div className="cursor-pointer">
      <form onSubmit={handleLogout}>
        {/* <button type="submit" disabled={loading}>
          {loading ? "Signing out..." : "Log out"}
          <LogOut className="inline-block ml-2" />
        </button> */}
        <Button variant="outline" type="submit" disabled={loading}>
          {loading ? "Signing out..." : "Log out"}
          <LogOut />
        </Button>
      </form>
    </div>
  );
};

export default Logout;
