'use client'
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import LogoText from "../../assets/images/BloomLogo.png"
import Logo from "../../assets/images/Logo.png"
import Image from "next/image";
import { useEffect, useState } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { CiMenuFries } from "react-icons/ci";
import { ChevronDown } from "lucide-react";

export default function Navbar(props: { color: string }) {

  const [navbarIsVisible, setnavbarIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState("")
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

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
            {/* <a href="/about"><div className="my-4 font-medium">About</div></a>
            <hr /> */}
            <div>
              <div
                className="my-4 font-medium cursor-pointer flex items-center justify-between"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                <span>Our Services</span>
                <ChevronDown className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} size={20} />
              </div>
              {mobileServicesOpen && (
                <div className="pl-4 pb-2">
                  <a href="/signup">
                    <div className="py-2 font-medium text-sm">For Apprentices</div>
                  </a>
                  <a href="/signup?type=recruiter">
                    <div className="py-2 font-medium text-sm">For Companies</div>
                  </a>
                </div>
              )}
            </div>
            <hr />
            {/* <div className="relative">
              <a href="/certified"><div className="mt-4 font-medium">Get Certified</div></a>
              <p className="text-white bg-[#897DD3] rounded-full px-1 py-1 left-[6.5rem] text-[0.4rem] absolute bottom-2">Coming Soon</p>
            </div> */}
          </div>
          <a href="/signup"><button className="mt-10 w-full text-sm text-white bg-[#4A2C84] px-6 py-3 font-medium rounded-2xl">Sign in</button></a>
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
        <div className="flex justify-between items-center relative ">
          <a href="/" className="hidden lg:flex lg:items-center lg:gap-2 lg:pl-10">
            <Image src={LogoText} alt="" width={120} />

          </a>
        </div>
        <div className="hidden text-[16px] lg:flex lg:pl-0  mx-auto min-w-max ">
          <div className="flex gap-[clamp(1.1rem,2.1vw,5rem)] xl:gap-[clamp(1.1rem,2.5vw,5rem)] items-center">
            <a href="/" className={`${currentPage == "home" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 hover:border-purple-800 transition-all`}>Home</a>
            {/* <a href="/about" className={`${currentPage == "about" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 hover:border-purple-800  transition-all`}>About Us</a> */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <div className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:-translate-y-[2px] hover:border-b-2 pb-1 hover:border-purple-800 transition-all">
                <span>Our Services</span>
                <ChevronDown className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} size={16} />
              </div>
              {servicesDropdownOpen && (
                <div className="absolute top-full pt-2 left-0 z-20">
                  <div className="bg-white shadow-lg rounded-lg py-2 min-w-[200px] border border-gray-100">
                    <a href="/signup" className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-800 transition-colors">
                      For Apprentices
                    </a>
                    <a href="/signup?type=recruiter" className="block px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-800 transition-colors">
                      For Companies
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="flex relative ms-[clamp(1.1rem,2.1vw,5rem)] xl:ms-[clamp(1.1rem,2.5vw,5rem)]">
              <a href="/certified" className={`${currentPage == "certified" ? "border-b-2 border-purple-800 text-purple-800" : ""} text-sm font-medium hover:-translate-y-[2px] hover:border-b-2 pb-1 hover:border-purple-800  transition-all`}>Get Certified</a>
              <div className="absolute right-[-30px] top-[-19px]">
                <p className="text-white bg-[#897DD3] rounded-full px-1 py-1 right-0 text-[0.5rem] ">Coming Soon</p>
              </div>
            </div> */}

        </div>

        <div className="flex gap-2 ">
          <a href="/all-trainings" className="text-sm text-white bg-[#4A2C84] px-6 py-3 font-semibold rounded-2xl min-w-max  ">Explore Programs</a>
          <a href="/signup" className="text-sm text-[#4A2C84] border border-[#4A2C84] px-6 py-3 font-semibold rounded-2xl min-w-max">Sign In</a>
        </div>
      </div>

    </div>
  )
}