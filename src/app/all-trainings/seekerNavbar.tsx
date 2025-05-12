'use client'
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import LogoText from "../../assets/images/BloomLogo.png"
import Logo from "../../assets/images/Logo.png"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SignOut } from "@/lib/Signout/Signout";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export default function SeekerNavbar(props: any) {

  const [navbarIsVisible, setnavbarIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState("")

  const url = reverseString(globalThis.window?.location.href)
  const page = url?.split("/")

  const router = useRouter()

  function reverseString(str: string) {
    var splitString = str?.split("");
    var reverseArray = splitString?.reverse();
    var joinArray = reverseArray?.join("");
    return joinArray;
  }

  useEffect(() => {
    if (reverseString(page[0]) == 'about') {
      setCurrentPage("about")
    }
    else if (reverseString(page[0]) == '') {
      setCurrentPage("home")
    }
    else if (reverseString(page[0]) == 'pricing') {
      setCurrentPage("pricing")
    }
    else if (reverseString(page[0]) == 'faqs') {
      setCurrentPage("faqs")
    }
  }, [])

  if (navbarIsVisible) {
    return (
      <div className="h-[200vh] w-screen px-6 overflow-hidden fixed top-0 bg-white z-10">
        <div className="py-5 flex justify-between items-center lg:justify-normal">
          <a href="/" className="lg:hidden">
            <Image src={LogoText} alt="logo" width={120} />
          </a>
          <div className="menu text-2xl lg:hidden cursor-pointer">
            <RxCross1 onClick={() => {
              document.getElementsByClassName('SlideIn')[0].classList.add('SlideOut'); setTimeout(() => {
                setnavbarIsVisible(false);
              }, 200);
            }} />
          </div>
        </div>
        <div className="SlideIn">
          <div className="px-4">
            <a href="/"><div className="my-4 font-medium cursor-pointer">Home</div></a>
            <hr className="" />
            <a href="/seeker/saved"><div className="my-4 font-medium">Saved</div></a>
            <hr />
            <a href="/seeker/applied"><div className="my-4 font-medium">Applied</div></a>
            <hr />
            <a href="/seeker/edit"><div className="my-4 font-medium">Profile</div></a>
            <hr />
          </div>
          {
            props.user ? <button onClick={() => { toast.success('Signing Out'); SignOut(); router.push('/signup') }} className="mt-10 w-full text-sm text-white bg-[#4A2C84] px-6 py-3 min-w-max font-medium rounded-2xl">Sign out</button> :
              <button onClick={() => { router.push('/signup') }} className="mt-10 w-full text-sm text-white bg-[#4A2C84] px-6 min-w-max py-3 font-medium rounded-2xl">Sign In</button>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-5 flex justify-between items-center lg:justify-normal">
      <div className="flex justify-between items-center relative w-[100%] ms-auto me-auto max-w-[1600px]">
        <a href="/" className="lg:hidden">
          <Image src={LogoText} alt="logo" width={120} />
        </a>
        <div className="menu text-2xl lg:hidden">
          <RxHamburgerMenu onClick={() => { setnavbarIsVisible(true) }} />
        </div>

        <div className="hidden lg:flex lg:items-center lg:w-full">
          <div className="flex items-center w-full">
            <a href="/" className="hidden lg:flex lg:items-center lg:gap-2 lg:pr-0 lg:pl-0">
              <Image src={LogoText} alt="" width={120} />
              <h1 className="text-3xl font-medium"></h1>
            </a>

            <div className="hidden lg:flex lg:px-10 mx-auto justify-center max-w-[600px]">
              <a href="/all-jobs" className={`${currentPage == "home" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800 transition-all`}>Home</a>
              <a href="/seeker/edit" className={`${currentPage == "faqs" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>Profile</a>
              <a href="/seeker/saved" className={`${currentPage == "about" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>Saved</a>
              <a href="/seeker/applied" className={`${currentPage == "pricing" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>Applied</a>

            </div>
          </div>

          {props.user ? <a onClick={() => { SignOut(); router.push('/signup') }} className="text-sm cursor-pointer text-white bg-[#4A2C84] px-6 py-3 font-medium rounded-2xl min-w-max">Sign out</a> : <a href="/signup" className=" text-sm text-white bg-[#4A2C84] px-6 py-3 font-medium cursor-pointer min-w-max rounded-2xl ">Sign in</a>}
        </div>
      </div>
    </div>
  )
}