"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RolesProtectProps {
  children: React.ReactNode; // type of children, same as html that returns a react component
  allowedRoles: string[];
}

export default function RolesProtectRoute({
  children,
  allowedRoles,
}: RolesProtectProps) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      alert(
        `You must be logged in as a ${allowedRoles.join(
          " "
        )} to access this page`
      );
      router.push("/");
      return;
    }

    setAuthorized(true);
  }, [router, allowedRoles]);

  if (!authorized) return null;

  return <>{children}</>;
}
