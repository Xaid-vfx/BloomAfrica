export default function HowTo() {
  return(
    <>
      <a href="/welcome" className=" lg:hidden flex justify-center min-w- mb-4">
        <div className="relative flex flex-col p-6 gap-3 border-2 border-[#14B8A6]/30 rounded-xl mx-auto w-full bg-gradient-to-br from-[#14B8A6]/5 via-white to-white shadow-md hover:shadow-lg transition-all overflow-hidden">
          {/* Left accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#14B8A6] to-[#0D9488]"></div>

          <span className="text-xs font-bold text-[#14B8A6] bg-[#14B8A6]/15 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
              <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Welcome to Prentis
          </span>

          <h1 className="text-lg text-left font-semibold text-[#0A1F44]">How to Use Prentis: A Quick Tour</h1>

          <div className="flex flex-col sm:flex-row text-sm text-[#515B6F] gap-2 items-baseline">
            <p>Get a guaranteed certificate and hands-on support to launch your own business after training.</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="rounded-lg min-w-max text-xs px-2 py-1 bg-green-100 text-green-800 font-medium">Getting Started</div>
            <div className="w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-40"></div>
            <div className="rounded-lg min-w-max text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium">Quick Tips</div>
            <div className="rounded-lg min-w-max text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium">Certificates</div>
            <div className="rounded-lg min-w-max text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium">Apprentice Guide</div>
          </div>

        </div>
      </a>
      <div className=" lg:flex hidden items-center border-2 border-[#14B8A6]/30 rounded-xl px-6 p-4 my-6 bg-gradient-to-br from-[#14B8A6]/5 via-white to-white shadow-md hover:shadow-lg transition-all relative overflow-hidden">
        {/* Left accent border */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#14B8A6] to-[#0D9488]"></div>

        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold mt-2 text-[#0A1F44]">How to Use Prentis: A Quick Tour</h1>
                  <span className="text-sm text-[#14B8A6] bg-[#14B8A6]/15 px-3 py-1.5 rounded-full flex items-center gap-1.5 min-w-[170px]">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
                      <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Welcome to Prentis
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
              <div className="rounded-xl border border-[#14B8A6]/30 px-3 py-2 font-semibold text-xs bg-[#14B8A6]/10 text-[#14B8A6] min-w-max">Quick Tips</div>
              <div className="rounded-xl border border-[#14B8A6]/30 px-3 py-2 font-semibold text-xs bg-[#14B8A6]/10 text-[#14B8A6] min-w-max">Certificates</div>
              <div className="rounded-xl border border-[#14B8A6]/30 px-3 py-2 font-semibold text-xs bg-[#14B8A6]/10 text-[#14B8A6] min-w-max">Apprentice Guide</div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
