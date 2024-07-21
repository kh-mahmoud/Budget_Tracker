import Image from "next/image";
import Link from "next/link";


const MobileLogo = () => {
    return (
        <Link href={"/"} className={`flex gap-x-2 items-center`}>
            <Image
                alt="logo"
                width={40}
                height={40}
                src={"/assets/logo.png"}
            />
            <p className={`bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-[1.8rem] font-bold leading-tight tracking-tighter text-transparent`}>
                BudgetTracker
            </p>

        </Link>
    );
}

export default MobileLogo;
