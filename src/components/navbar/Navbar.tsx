'use client'
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import PrentisLogo from "../Logo/PrentisLogo";
import { useEffect, useState } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { CiMenuFries } from "react-icons/ci";

export default function Navbar(props: { color: string }) {

  const [navbarIsVisible, setnavbarIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState("")

  const url = reverseString(globalThis.window?.location.href)
  const page = url?.split("/")

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
    else if (reverseString(page[0]) == 'certified') {
      setCurrentPage("certified")
    }
  }, [])


  // onClick={() => {
  //   document.getElementsByClassName('SlideIn')[0].classList.add('SlideOut')
  //   
  // }}
  if (navbarIsVisible) {

    return (
      <div className="h-[200vh] w-screen px-6 sm:px-12 overflow-hidden fixed top-0 gradient z-50 ">
        <div className="py-6 flex justify-between items-center sm:justify-normal">
          <a href="/" className="sm:hidden">
            <PrentisLogo className="!text-[#14B8A6]" />
          </a>
          <button
            onClick={() => {
              document.getElementsByClassName('SlideIn')[0].classList.add('SlideOut');
              setTimeout(() => {
                setnavbarIsVisible(false);
              }, 200);
            }}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all sm:hidden"
            aria-label="Close menu"
          >
            <RxCross1 className="text-xl text-gray-700" />
          </button>
        </div>
        <div className="SlideIn">
          <div className="px-4">
            <a href="/"><div className="my-4 font-medium cursor-pointer">Home</div></a>
            <hr className="" />
            <a href="/explore-programs"><div className="my-4 font-medium cursor-pointer">About Us</div></a>
            <hr />
            <a href="/how-it-works"><div className="my-4 font-medium cursor-pointer">How It Works</div></a>
            <hr />
            <a href="/for-trainers"><div className="my-4 font-medium cursor-pointer">For Trainers</div></a>
            <hr />
            {/* <div className="relative">
              <a href="/certified"><div className="mt-4 font-medium">Get Certified</div></a>
              <p className="text-white bg-[#897DD3] rounded-full px-1 py-1 left-[6.5rem] text-[0.4rem] absolute bottom-2">Coming Soon</p>
            </div> */}
          </div>
          <a href="/signup"><button className="mt-10 w-full text-sm text-white bg-[#14B8A6] px-6 py-3 font-medium rounded-2xl">Sign in</button></a>
        </div>
      </div>
    )
  }

  return (
    <div className={`px-6 sm:px-12 py-4 flex justify-between items-center sm:justify-normal  ${props.color == "light" ? 'bg-[#0A1F44]' : props.color == "white" ? 'bg-[#0F172A]' : ''}`}>

      <a href="/" className="sm:hidden">
        <PrentisLogo className="!text-white" />
      </a>
      <div className={`menu gap-3 items-center flex sm:hidden`}>
        <a
          href="/signup"
          className={`text-sm px-4 py-2 font-semibold rounded-xl transition-all ${
            props.color == "light"
              ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
          }`}
        >
          Sign in
        </a>
        <button
          onClick={() => setnavbarIsVisible(true)}
          className={`p-2 rounded-xl transition-all ${
            props.color == "light"
              ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
          }`}
          aria-label="Open menu"
        >
          <CgMenuRightAlt className="text-2xl" />
        </button>
      </div>

      <div className="hidden sm:flex sm:items-center sm:justify-between sm:w-full ms-auto me-auto max-w-[1300px]">
        <div className="flex justify-between items-center relative ">
          <a href="/" className="hidden sm:flex sm:items-center sm:gap-2">
            <PrentisLogo className="!text-white" />
          </a>
        </div>
        <div className="hidden text-[16px] sm:flex sm:pl-0  mx-auto min-w-max ">
          <div className="flex gap-[clamp(1.1rem,2.1vw,5rem)] xl:gap-[clamp(1.1rem,2.5vw,5rem)] items-center">
            <a href="/" className={`${currentPage == "home" ? `border-b-2 ${props.color == "light" ? 'border-white text-white' : 'border-white text-white'}` : `${props.color == "light" ? 'text-white' : 'text-white'}`} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 ${props.color == "light" ? 'hover:border-white' : 'hover:border-white'} transition-all`}>Home</a>
            <a href="/explore-programs" className={`${props.color == "light" ? 'text-white' : 'text-white'} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 ${props.color == "light" ? 'hover:border-white' : 'hover:border-white'} transition-all`}>About Us</a>
            <a href="/how-it-works" className={`${props.color == "light" ? 'text-white' : 'text-white'} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 ${props.color == "light" ? 'hover:border-white' : 'hover:border-white'} transition-all`}>How It Works</a>
            <a href="/for-trainers" className={`${props.color == "light" ? 'text-white' : 'text-white'} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 ${props.color == "light" ? 'hover:border-white' : 'hover:border-white'} transition-all`}>For Trainers</a>
          </div>
          {/* <div className="flex relative ms-[clamp(1.1rem,2.1vw,5rem)] xl:ms-[clamp(1.1rem,2.5vw,5rem)]">
              <a href="/certified" className={`${currentPage == "certified" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 hover:border-purple-800  transition-all`}>Get Certified</a>
              <div className="absolute right-[-30px] top-[-19px]">
                <p className="text-white bg-[#897DD3] rounded-full px-1 py-1 right-0 text-[0.5rem] ">Coming Soon</p>
              </div>
            </div> */}

        </div>

        <div className="flex gap-2 ">
          <a href="/signup" className={`text-sm border-2 px-6 py-3 font-semibold rounded-2xl min-w-max transition-all ${props.color == "light" ? 'border-white text-white hover:bg-white/10' : 'text-white border-white hover:bg-white/10'}`}>Sign In</a>
        </div>
      </div>

    </div>
  )
}