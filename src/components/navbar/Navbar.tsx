import { RxHamburgerMenu } from "react-icons/rx";
import Logo from "../../assets/images/Logo.jpeg"
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="py-1 px-2 xl:px-4 pr-6 w-full flex justify-between items-center">
      <div className="flex items-center w-1/2">
        <Link href='/'><Image src={Logo} height={100} width={60} alt="logo" /></Link>
        <div className="xl:flex xl:items-baseline">
          <p className="text-3xl font-bold tracking-tight mr-16">bloom</p>
          <div className="menuitems gap-12 hidden xl:flex xl:items-center">
            <Link href='/about'><div className="tracking-wide">About</div></Link>
            <div className="tracking-wide">Products</div>
            <div className="tracking-wide">Resources</div>
            <div className="tracking-wide">Pricing</div>
          </div>
        </div>
      </div>
      <div className="menu text-2xl xl:hidden">
        <RxHamburgerMenu />
      </div>
      <div className='hidden gap-2 my-4 xl:flex'>
        <button className='border rounded-xl text-sm px-5 py-2 bg-black text-white '>Sign In</button>
        <button className='border border-[#c4c4c4] rounded-xl text-sm px-5 py-2'>Find Jobs</button>
      </div>
    </div>
  )
}