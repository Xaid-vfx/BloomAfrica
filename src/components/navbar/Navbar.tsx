'use client'
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import LogoText from "../../assets/images/BloomLogo.png"
import Logo from "../../assets/images/Logo.png"
import Image from "next/image";
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
      <div className="h-[200vh] w-screen px-4 overflow-hidden fixed top-0 gradient z-10 ">
        <div className="py-6 flex justify-between items-center lg:justify-normal">
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
            <a href="/about"><div className="my-4 font-medium">About</div></a>
            <hr />
            <a href="/signup"><div className="my-4 font-medium">Recruiting? <span className="text-[#4A2C84]">Post a Job</span></div></a>
            <hr />
            <div className="relative">
              <a href="/certified"><div className="mt-4 font-medium">Get Certified</div></a>
              <p className="text-white bg-[#897DD3] rounded-full px-1 py-1 left-[6.5rem] text-[0.4rem] absolute bottom-2">Coming Soon</p>
            </div>
          </div>
          <a href="/signup"><button className="mt-10 w-full text-sm text-white bg-[#4A2C84] px-6 py-3 font-medium rounded-3xl">Sign in</button></a>
        </div>
      </div>
    )
  }

  return (
    <div className={`px-4 py-6 flex justify-between items-center lg:justify-normal  ${props.color == "white" ? 'bg-white' : ''}`}>

      <a href="/" className="lg:hidden">
        <Image src={LogoText} alt="logo" width={120} />
      </a>
      <div className="menu gap-4 items-center flex text-3xl lg:hidden">
        <a href="/signup" className="text-sm text-[#4A2C84]">Sign in</a>
        <CgMenuRightAlt onClick={() => {
          setnavbarIsVisible(true)
        }} />
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-between lg:w-full ms-auto me-auto max-w-[1600px]">
        <div className="flex justify-between items-center relative w-[70%]">
          <a href="/" className="hidden lg:flex lg:items-center lg:gap-2 lg:px-10">
            <Image src={Logo} alt="" width={50} />
            <h1 className="text-3xl font-medium">Bloom</h1>
          </a>

          <div className="hidden text-[16px] lg:flex lg:pl-10 pr-10 min-w-max">
            <a href="/" className={`${currentPage == "home" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-4 font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 px-2 hover:border-purple-800 transition-all`}>Home</a>
            <a href="/about" className={`${currentPage == "about" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-4 font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 px-2  hover:border-purple-800  transition-all`}>About</a>
            <a href="/signup" className={`${currentPage == "pricing" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-4 font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 px-2  hover:border-purple-800  transition-all`}>Recruiting? <span className="text-[#4A2C84]">Post a Job</span></a>
            <a href="/certified" className={`${currentPage == "certified" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-4 font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 px-2  hover:border-purple-800  transition-all`}>Get Certified</a>
            <p className="text-white bg-[#897DD3] rounded-full px-1 py-1 right-0 text-[0.5rem] absolute top-0">Coming Soon</p>

          </div>
        </div>

        <div className="flex gap-2">
          <a href="/all-jobs" className="text-sm text-white bg-[#4A2C84] px-6 py-3 font-semibold rounded-3xl">Find Jobs</a>
          <a href="/signup" className="text-sm text-[#4A2C84] border border-[#4A2C84] px-6 py-3 font-semibold rounded-3xl">Sign In</a>
        </div>
      </div>

    </div>
  )
}