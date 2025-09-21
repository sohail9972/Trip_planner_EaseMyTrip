import { Link, useLocation } from "react-router-dom"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "./icons"

export function MainNav() {
  const { pathname } = useLocation()

  return (
    <div className="mr-4 hidden md:flex">
      <Link to="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          to="/trips"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/trips" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Trips
        </Link>
        <Link
          to="/destinations"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/destinations")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Destinations
        </Link>
        <Link
          to="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/about" ? "text-foreground" : "text-foreground/60"
          )}
        >
          About
        </Link>
      </nav>
    </div>
  )
}
