import { FaFacebook, FaLinkedinIn, FaRocket, FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { RiLinksFill } from "react-icons/ri";
import Logo from "../../assets/images/Logo.png"
import BloomLogoWhite from "../../assets/images/BloomLogoWhite.png"
import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-[#171c1f] lg:bg-[#1D1B1B]">
      <div className=" px-8 py-10 text-white lg:flex lg:justify-between lg:px-24 ms-auto me-auto max-w-[1750px] ">
        <div className="lg:w-1/3">
          <div className="flex items-center gap-2">
            <Image src={BloomLogoWhite} alt="logo" width={120} />
          </div>
          <p className="text-xs leading-6 mt-2 lg:text-sm lg:mt-4 lg:leading-7">Join Bloom today and become part of a community committed to continuous learning and professional excellence.</p>

          <div className="socialicons mt-5 mb-8 flex gap-4 lg:mt-6">
            <a target="blank" href="https://x.com/_bloomAfrica" className="bg-black p-3 rounded-full cursor-pointer"><FaXTwitter /></a>
            <a target="blank" href="https://www.linkedin.com/company/bloomafrica1" className="bg-black p-3 rounded-full cursor-pointer"><FaLinkedinIn /></a>
            <a target="blank" href="https://facebook.com/BloomApprenticeships1" className="bg-black p-3 rounded-full cursor-pointer"><FaFacebook /></a>
          </div>
        </div>

        <div className="lg:flex lg:w-1/2 lg:justify-evenly">
          <div className="flex flex-col">
            <h2 className="text-lg font-medium lg:text-xl lg:font-medium">Company</h2>
            <a href="/" className="text-sm font-light my-3">Home</a>
            <a href="/about" className="text-sm font-light my-3">About</a>
            <a href="/certified" className="text-sm font-light my-3">Get Certified</a>
          </div>

          <div className="mt-12 lg:mt-0 flex flex-col">
            <h2 className="text-lg font-medium lg:text-xl lg:font-medium">Legal</h2>
            <a href="/privacy-policy" className="text-sm font-light my-3">Privacy Policy</a>
            <a href="/privacy-policy" className="text-sm font-light my-3">Terms of Use</a>
          </div>
        </div>
      </div>
      <hr className="border-[#505050]" />
      <div className="py-6 bg-[#1D1B1B] text-center text-white font-light">Bloom 2024. All Rights Reserved</div>
    </div>
  )
}