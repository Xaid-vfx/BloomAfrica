'use client'
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import PrentisLogo from "@/components/Logo/PrentisLogo";
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
            <PrentisLogo className="!text-[#14B8A6]" />
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
            <a href={props.user ? "/seeker/saved" : "/signup"} className="block">
              <div className="my-4 font-medium cursor-pointer">Saved</div>
            </a>
            <hr />
            <a href={props.user ? "/seeker/applied" : "/signup"} className="block">
              <div className="my-4 font-medium cursor-pointer">Applied</div>
            </a>
            <hr />
            <a href={props.user ? "/seeker/edit" : "/signup"} className="block">
              <div className="my-4 font-medium cursor-pointer">Profile</div>
            </a>
            <hr />
          </div>
          {
            props.user ? <button onClick={() => { toast.success('Signing Out'); SignOut(); router.push('/signup') }} className="mt-10 w-full text-sm text-white bg-[#14B8A6] hover:bg-[#0D9488] px-6 py-3 min-w-max font-medium rounded-2xl transition-colors">Sign out</button> :
              <button onClick={() => { router.push('/signup') }} className="mt-10 w-full text-sm text-white bg-[#14B8A6] hover:bg-[#0D9488] px-6 min-w-max py-3 font-medium rounded-2xl transition-colors">Sign In</button>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-5 flex justify-between items-center lg:justify-normal">
      <div className="flex justify-between items-center relative w-[100%] ms-auto me-auto max-w-[1600px]">
        <a href="/" className="lg:hidden">
          <PrentisLogo className="!text-[#14B8A6]" />
        </a>
        <div className="menu text-2xl lg:hidden">
          <RxHamburgerMenu onClick={() => { setnavbarIsVisible(true) }} />
        </div>

        <div className="hidden lg:flex lg:items-center lg:w-full">
          <div className="flex items-center w-full">
            <a href="/" className="hidden lg:flex lg:items-center lg:gap-2 lg:pr-0 lg:pl-0">
              <PrentisLogo className="!text-[#14B8A6]" />
            </a>

            <div className="hidden lg:flex lg:px-10 mx-auto justify-center max-w-[600px]">
              <a href="/all-trainings" className={`${currentPage == "home" ? "border-b-2 border-[#14B8A6] text-[#14B8A6]" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-[#14B8A6] transition-all`}>Home</a>
              <a href={props.user ? "/seeker/edit" : "/signup"} className={`${currentPage == "faqs" ? "border-b-2 border-[#14B8A6] text-[#14B8A6]" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-[#14B8A6] transition-all cursor-pointer`}>Profile</a>
              <a href={props.user ? "/seeker/saved" : "/signup"} className={`${currentPage == "about" ? "border-b-2 border-[#14B8A6] text-[#14B8A6]" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-[#14B8A6] transition-all cursor-pointer`}>Saved</a>
              <a href={props.user ? "/seeker/applied" : "/signup"} className={`${currentPage == "pricing" ? "border-b-2 border-[#14B8A6] text-[#14B8A6]" : ""} text-sm mx-8 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-[#14B8A6] transition-all cursor-pointer`}>Applied</a>
            </div>
          </div>

          {props.user ? <a onClick={() => { SignOut(); router.push('/signup') }} className="text-sm cursor-pointer text-white bg-[#14B8A6] hover:bg-[#0D9488] px-6 py-3 font-medium rounded-2xl min-w-max transition-colors">Sign out</a> : <a href="/signup" className=" text-sm text-white bg-[#14B8A6] hover:bg-[#0D9488] px-6 py-3 font-medium cursor-pointer min-w-max rounded-2xl transition-colors">Sign in</a>}
        </div>
      </div>
    </div>
  )
}