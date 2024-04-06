'use client'
import { RxHamburgerMenu } from "react-icons/rx";
import LogoText from "../../assets/images/BloomLogo.png"
import Logo from "../../assets/images/Logo.png"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SignOut } from "@/lib/Signout/Signout";
import { useRouter } from "next/navigation";

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
      <div className="h-[200vh] w-screen px-8 overflow-hidden fixed top-0 bg-white z-10 SlideIn">
        <div className="flex items-center justify-between py-6">
          <div className="font-medium text-2xl cursor-pointer" onClick={() => {
            document.getElementsByClassName('SlideIn')[0].classList.add('SlideOut')
            setTimeout(() => {
              setnavbarIsVisible(false)
            }, 200);
          }}>X</div>
          <Image src={LogoText} alt="logo" className="w-2/5" />
        </div>
        <div>
          <a href="/"><div className="my-4 font-medium cursor-pointer">Home</div></a>
          <hr />
          <a href="/about"><div className="my-4 font-medium">Saved Jobs</div></a>
          <hr />
          <a href="/pricing"><div className="my-4 font-medium">My Jobs</div></a>
          <hr />
          <a href="/faqs"><div className="my-4 font-medium">FAQs</div></a>
          <hr />
        </div>
        <button className="mt-10 w-full text-sm text-white bg-[#4A2C84] px-6 py-3 font-medium rounded-3xl" onClick={() => { setnavbarIsVisible(false) }}>Join Waitlist</button>
      </div>
    )
  }

  return (
    <div className="px-6 py-5 flex justify-between items-center lg:justify-normal">

      <a href="/" className="lg:hidden">
        <Image src={LogoText} alt="logo" width={120} />
      </a>
      <div className="menu text-2xl lg:hidden">
        <RxHamburgerMenu onClick={() => { setnavbarIsVisible(true) }} />
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-between lg:w-full">
        <div className="flex items-center">
          <a href="/all-jobs" className="hidden lg:flex lg:items-center lg:gap-2 lg:px-10">
            <Image src={Logo} alt="" width={50} />
            <h1 className="text-3xl font-medium">Bloom</h1>
          </a>

          <div className="hidden lg:flex lg:pl-10">
            <a href="/all-jobs" className={`${currentPage == "home" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800 transition-all`}>Home</a>
            <a href="/seeker/saved" className={`${currentPage == "about" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>Saved Jobs</a>
            <a href="/seeker/applied" className={`${currentPage == "pricing" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>My Jobs</a>
            {/* <a href="/faqs" className={`${currentPage == "faqs" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>FAQs</a> */}
          </div>
        </div>

        {props.user ? <a onClick={() => { SignOut(); router.push('/signup') }} className="text-sm cursor-pointer text-white bg-[#4A2C84] px-6 py-3 font-medium rounded-3xl">Sign out</a> : <a href="/signup" className="text-sm text-white bg-[#4A2C84] px-6 py-3 font-medium cursor-pointer rounded-3xl">Sign in</a>}
      </div>

    </div>
  )
}