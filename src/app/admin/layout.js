"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const user = useSelector((s) => s.auth?.user);

  useEffect(() => {
    // if not authenticated send to login
    if (typeof isAuthenticated !== "undefined" && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    // if authenticated but not admin, send to home
    if (isAuthenticated && user && user.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Render children while checks happen; children will render only for admin users
  return <>{children}</>;
}
