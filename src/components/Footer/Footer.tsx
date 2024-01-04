import { FaRocket, FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { RiLinksFill } from "react-icons/ri";

export default function Footer() {
  return (
    <div className="bg-[rgb(25,25,25)] text-[#949494] px-10 py-20 lg:flex lg:justify-around w-full items-center">
      <div>
        <div>
          <h1 className="font-semibold text-3xl flex items-center gap-2">Bloom <FaRocket /></h1>
          <p className="py-3 text-base">Turn regular Jobs into Apprenticeships</p>
        </div>
        <div className="py-6">
          <div className="flex flex-col gap-4">
            <input type="email" className="px-6 py-3 rounded-md w-full lg:w-auto" placeholder="ENTER EMAIL" />
            <button className="rounded-md w-full border py-3 lg:w-auto">GET STARTED</button>
          </div>
        </div></div>
      <div className="py-6">
        <h2 className="text-lg text-center py-4">Follow us</h2>
        <div className="flex justify-center gap-4 text-sm">
          <a href="https://x.com/_bloomAfrica" className="border border-[#949494] rounded-full p-2"><FaXTwitter /></a>
          <div className="border border-[#949494] rounded-full p-2"><FaLinkedin /></div>
          <div className="border border-[#949494] rounded-full p-2"><RiLinksFill /></div>
        </div>
        <div className="line border-[#949494] border-t-[1px] my-4"></div>
        <div>
          <div className="flex text-sm gap-4 justify-center mb-2">
            <p>
              Terms & Conditions
            </p>
            <p>Privacy Policy</p>
          </div>
          <p className="text-xs text-center">All Rights Reserved</p>
        </div>
      </div>
    </div>
  )
}