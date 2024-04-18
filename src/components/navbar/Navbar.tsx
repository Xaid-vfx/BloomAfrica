'use client'
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import LogoText from "../../assets/images/BloomLogo.png"
import Logo from "../../assets/images/Logo.png"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {

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
    else if (reverseString(page[0]) == 'pricing') {
      setCurrentPage("pricing")
    }
    else if (reverseString(page[0]) == 'faqs') {
      setCurrentPage("faqs")
    }
  }, [])


  // onClick={() => {
  //   document.getElementsByClassName('SlideIn')[0].classList.add('SlideOut')
  //   
  // }}
  if (navbarIsVisible) {

    return (
      <div className="h-[200vh] w-screen px-6 overflow-hidden fixed top-0 gradient z-10">
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
            <a href="/about"><div className="my-4 font-medium">About</div></a>
            <hr />
            <a href="/pricing"><div className="my-4 font-medium">Pricing</div></a>
            <hr />
            <a href="/faqs"><div className="my-4 font-medium">FAQs</div></a>
            <hr />
          </div>
          <a href="/signup"><button className="mt-10 w-full text-sm text-white bg-[#4A2C84] px-6 py-3 font-medium rounded-3xl">Sign in</button></a>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-5 flex justify-between items-center lg:justify-normal">

      <a href="/" className="lg:hidden">
        <Image src={LogoText} alt="logo" width={120} />
      </a>
      <div className="menu text-2xl lg:hidden">
        <RxHamburgerMenu onClick={() => {
          setnavbarIsVisible(true)
        }} />
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-between lg:w-full">
        <div className="flex items-center">
          <a href="/" className="hidden lg:flex lg:items-center lg:gap-2 lg:px-10">
            <Image src={Logo} alt="" width={50} />
            <h1 className="text-3xl font-medium">Bloom</h1>
          </a>

          <div className="hidden lg:flex lg:pl-10">
            <a href="/" className={`${currentPage == "home" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800 transition-all`}>Home</a>
            <a href="/about" className={`${currentPage == "about" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>About</a>
            <a href="/pricing" className={`${currentPage == "pricing" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>Pricing</a>
            <a href="/faqs" className={`${currentPage == "faqs" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm mx-6 font-medium hover:-translate-y-[2px] hover:border-b-2 hover:border-purple-800  transition-all`}>FAQs</a>
          </div>
        </div>

        <a href="/signup" className="text-sm text-white bg-[#4A2C84] px-6 py-3 font-medium rounded-3xl">Sign In</a>
      </div>

    </div>
  )
}