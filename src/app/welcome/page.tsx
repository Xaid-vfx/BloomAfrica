import Image from "next/image"
import Navbar from "@/components/navbar/Navbar"
import Footer from "@/components/Footer/Footer"



export default function WelcomePage() {
  return(
    <>
      <Navbar/>
      <div className="flex flex-col items-center w-full gap-5 my-5 lg:mb-32 lg:mt-20">
        <div className=' flex flex-col lg:flex-row gap-5 w-full px-5 max-w-[110rem]'>
          <div className="w-full relative rounded-xl overflow-hidden bg-cover bg-center text-white p-4 lg:p-7" style={{ backgroundImage: "url('/engineer.jpg')" }}>
            <div className="absolute inset-0 bg-black/70"></div> {/* gradient overlay */}
            <div className="relative z-[1]">
              <p className="text-6xl font-bold mb-2">1</p>
              <p className="text-2xl font-semibold">Get Started</p>
              <p className="text-sm md:text-base lg:text-lg">Register, join as a learner, find apprenticeship programs, and build the skills to run a business or grow your career.</p>
            </div>
          </div>
          <a
            href="/welcome/trainer"
            className="bg-[#4A2C84] lg:hidden hover:bg-[#2f185e] text-white font-semibold py-3 px-6 rounded-2xl max-w-[25rem] mx-auto transition"
          >
            Not a Learner?  Become a Trainer
          </a>
          <div className="w-full relative rounded-xl overflow-hidden bg-cover bg-center text-white p-4 lg:p-7" style={{ backgroundImage: "url('/workers.jpg')" }}>
            <div className="absolute inset-0 bg-black/70"></div> {/* gradient overlay */}
            <div className="relative z-[1] text-right lg:text-left">
              <p className="text-6xl font-bold mb-2 ">2</p>
              <p className="text-2xl font-semibold ">Certificate</p>
              <p className="text-sm md:text-base lg:text-lg">The Bloom Certificate isn’t just for show. It proves you’ve done real, hands-on work and finished what you started. It sets you apart. <br /><br />
              It’s a mark of grit, capability, and readiness. It also gives you access to <span className='font-bold'>exclusive Bloom alumni benefits</span>, support, and growth opportunities. </p>
            </div>
          </div>
          <div className="w-full relative rounded-xl overflow-hidden bg-cover bg-center text-white p-4 lg:p-7" style={{ backgroundImage: "url('/carpenter.jpg')" }}>
            <div className="absolute inset-0 bg-black/70"></div> {/* gradient overlay */}
            <div className="relative z-[1]">
              <p className="text-6xl font-bold mb-2">3</p>
              <p className="text-2xl font-semibold">Bloom Alumni Benefits</p>
              <p className="text-sm md:text-base lg:text-lg">As a certified Bloom graduate, you’ll gain exclusive access to our alumni community and resources, including:

                <ul className="list-decimal font-semibold gap-2 flex flex-col underline pl-4 pt-5">
                  <li>Find co-founders/Business partners</li>
                  <li>Business idea validation</li>
                  <li>Legal help and incorporation</li>
                  <li>Access to financing</li>
                  <li>Growth and Strategy</li>
                  <li>Ongoing Support or Check-ins</li>
                </ul>
              </p>
              
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}