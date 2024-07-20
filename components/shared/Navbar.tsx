'use client'

import { GenerateNavLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Logo from "./Logo";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";




const Navbar = () => {

    const { id } = useParams()
    const { theme } = useTheme();
    const [mode, setMode] = useState<string | undefined>()

    useEffect(() => {
        setMode(theme)
    }, [theme])


    return (
        <div className="hidden nav:flex border-b border-amber-500">
            <nav className="flex container  items-center w-full justify-between ">
                <div className="flex h-[80px] items-center w-full min-h-[60px] gap-x-6">
                    <Logo />

                    <ul className="flex gap-x-6 h-full ">
                        {
                            GenerateNavLinks(id).map(link => (
                                <NavItems key={link.label} link={link} />
                            ))
                        }
                    </ul>

                    <div className="flex flex-grow justify-end items-center gap-x-6">
                        <ThemeSwitcher />
                        <div className=" flex items-center scale-125">
                            <UserButton appearance={{
                                baseTheme: mode === "dark" ? dark : undefined
                            }}
                                afterSignOutUrl="/sign-in"
                            />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;



const NavItems = ({ link }: { link: { path: string, label: string } }) => {
    const pathname = usePathname();
    const [isActive, setIsActive] = useState<Boolean>(pathname === link.path);

    useEffect(() => {
        setIsActive(pathname === link.path);
    }, [pathname, link.path]);

    return (
        <div className="relative">
            <Link className="h-full flex items-center" href={link.path}>
                <li className={`text-[1.2rem] hover:text-foreground ${cn(buttonVariants({ variant: "ghost" }))} ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {link.label}
                </li>
            </Link>

            {isActive && (
                <div className="absolute rounded-md translate-x-3 bottom-0 left-0 h-[2px] w-[80%] bg-amber-500" />
            )}
        </div>
    );
};