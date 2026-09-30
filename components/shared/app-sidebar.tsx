import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";
import React from "react";

function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside>
      <div>
        <span>{siteConfig.name}</span>
      </div>

      <nav>{}</nav>
    </aside>
  );
}

export default AppSidebar;
