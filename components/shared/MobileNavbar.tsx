'use client'


import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Logo from "./Logo";
import { GenerateNavLinks } from "@/constants";



const MobileNavbar = () => {



    return (
        <div className="hidden max-nav:flex border-b ">
            <nav className="px-8 flex items-center w-full justify-between ">
                <div className="flex h-[80px] items-center  w-full min-h-[60px] gap-x-6">

                    <Sidebar>
                        <div className={`cursor-pointer ${cn(buttonVariants({ variant: "ghost" }))}}`}>
                            <Menu />
                        </div>
                    </Sidebar>

                    <div className={`flex cursor-pointer flex-grow items-center justify-center`}>
                        <Logo />
                    </div>

                    <div className="flex items-center gap-x-4">
                        <ThemeSwitcher />
                        <div className=" flex items-center scale-125"><UserButton afterSignOutUrl="/sign-in" /></div>
                    </div>


                </div>
            </nav>
        </div>
    );
}

export default MobileNavbar;


const NavItems = ({ link }: { link: { path: string, label: string } }) => {
    const pathname = usePathname();
    const [isActive, setIsActive] = useState<Boolean>(pathname === link.path)

    useEffect(() => {
        setIsActive(pathname === link.path);
    }, [pathname, link.path]);

    return (
        <div className="relative w-full ">
            <Link className={` w-full group ${cn(buttonVariants({ variant: "ghost" }))} `} href={link.path}>
                <li className={`text-[1.2rem] w-full h-full  group-hover:text-foreground  ${pathname === link.path ? "text-foreground" : "text-muted-foreground"}`}>
                    {link.label}
                </li>
            </Link>


            {isActive &&
                <div className="absolute rounded-md translate-x-12 bottom-0 left-0 h-[2px] w-[80%]  bg-foreground" />
            }
        </div>



    )
}



const Sidebar = ({ children }: { children: JSX.Element }) => {

    const { id } = useParams()

    return (
        <Sheet >
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]" side={'left'}>

                <SheetHeader>
                    <SheetTitle>
                        <Logo />
                    </SheetTitle>
                </SheetHeader>

                <ul className="flex w-full flex-col items-start  gap-y-4 mt-6 ">
                    {
                        GenerateNavLinks(id).map(link => (
                            <NavItems key={link.label} link={link} />
                        ))
                    }
                </ul>
            </SheetContent>
        </Sheet>
    )
}
