export default function HowTo() {
  return(
    <>
      <a href="/welcome" className=" lg:hidden flex justify-center min-w- mb-4">
        <div className="flex flex-col p-5 gap-2 border border-[#a697c4] rounded-2xl mx-auto w-full bg-[#f3f2ff] hover:drop-shadow-lg">
          
          <span className="text-xs font-bold text-[#4A2C84] bg-[#4A2C84]/20 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#4A2C84"/>
              <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Welcome to Bloom
          </span>

          <h1 className="text-lg text-left font-medium underline">How to Use Bloom: A Quick Tour</h1>

          <div className="flex flex-col sm:flex-row text-sm text-[#515B6F] gap-2 items-baseline">
            <p>Get a guaranteed certificate and hands-on support to launch your own business after training.</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="rounded-lg min-w-max text-xs px-2 py-1 bg-green-100 text-green-800">Getting Started</div>
            <div className="w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-40"></div>
            <div className="rounded-lg min-w-max text-xs px-2 py-1 border bg-white text-[#4A2C84]">Quick Tips</div>
            <div className="rounded-lg min-w-max text-xs px-2 py-1 border bg-white text-[#4A2C84]">Certificates</div>
            <div className="rounded-lg min-w-max text-xs px-2 py-1 border bg-white text-[#4A2C84]">Apprentice Guide</div>
          </div>

        </div>
      </a>
      <div className=" lg:flex hidden items-center justify-between border rounded-2xl px-6 p-4 my-6 border-[#a697c4] bg-[#f3f2ff] hover:drop-shadow-md">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-medium mt-2">How to Use Bloom: A Quick Tour</h1>
                  <span className="text-sm text-[#4A2C84] bg-[#4A2C84]/10 px-2 py-1 rounded-full flex items-center gap-1 min-w-[150px]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#4A2C84"/>
                      <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Welcome to Bloom
                  </span>
                </div>
                <div className="flex mt-2 text-base text-[#515B6F] gap-2 items-baseline pr-10">
                  <p>Get a guaranteed certificate and hands-on support to launch your own business after training.</p>
                  
                </div>
              </div>
            </div>
            <div className="flex gap-2 my-4 items-center">
              <div className="rounded-xl text-xs min-w-max px-3 py-2 font-semibold bg-green-100 text-green-800">Getting Started</div>
              <div className="w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-40"></div>
              <div className="rounded-xl border px-3 py-2 font-semibold text-xs bg-white text-[#4A2C84] min-w-max">Quick Tips</div>
              <div className="rounded-xl border px-3 py-2 font-semibold text-xs bg-white text-[#4A2C84] min-w-max">Certificates</div>
              <div className="rounded-xl border px-3 py-2 font-semibold text-xs bg-white text-[#4A2C84] min-w-max">Apprentice Guide</div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <a href="/welcome" className="bg-white border text-gray-700 border-neutral-400 font-semibold px-4 py-3 rounded-2xl w-[153px] ">For Apprentices</a>
            <a href="/welcome/trainer" className="text-white py-3 text-center bg-[#4A2C84] rounded-2xl font-medium w-[153px] hover:bg-[#2f185e]">For Trainers</a>
          </div>
        </div>
      </div>
      
    </>
  )
}



