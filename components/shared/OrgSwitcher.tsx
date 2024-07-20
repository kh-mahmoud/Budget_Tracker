'use client';

import { OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const OrgSwitcher = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<string | undefined>()

  useEffect(() => {
    setMode(theme)
  }, [theme])

  return (
    <OrganizationSwitcher
      appearance={{
        baseTheme: mode === "dark" ? dark : undefined
      }}
    />
  );
};

export default OrgSwitcher;
