import MobileNavbar from "@/components/shared/MobileNavbar";
import Navbar from "@/components/shared/Navbar";



const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <main>
            <Navbar/>
            <MobileNavbar/>
            <div>{children}</div>
        </main>
    );
}

export default Layout;
