import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"

export default function TrainerLanding() {
  return(
    <>
      <Navbar />
      <div className="bg-white text-gray-800">
   
          <section className="relative bg-gray-900 text-white py-20 bg-[url('/NigeriaMarket.jpg')] bg-cover bg-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 z-0" />

            {/* Content */}
            <div className="relative z-10">
              <div className="max-w-6xl mx-auto px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Turn Your Skills into Income</h1>
                <p className="text-lg mb-6">
                  Launch your training business in minutes. No tech headaches. Just teach, earn, and grow.
                </p>
                <a
                  href="/signup?type=recruiter"
                  className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold py-3 px-10 rounded-2xl max-w-[25rem] mx-auto transition"
                >
                  Become a trainer on Prentis
                </a>
              </div>
            </div>
          </section>

          <section className="py-20 bg-orange-50/10">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Why Trainers Choose Prentis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2">💸 Make Real Income</h3>
                  <p>
                    Set your own enrollment fee and receive payments directly. Tap into multiple monetization streams with ease.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">⚡ Launch in Minutes</h3>
                  <p>
                    Sign up, create your program, and start enrolling learners—all in less than an hour.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">📣 Get Discovered</h3>
                  <p>
                    Your program is listed in our marketplace so learners can find and apply with ease.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-bl from-[#14B8A6]/20 via-white to-[#0A1F44]/10 py-20">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="text-4xl font-bold text-[#14B8A6]">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Create Your Trainer Account</h3>
                    <p>Sign up with Google or email OTP. Select “Trainer” as your account type.</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="text-4xl font-bold text-[#14B8A6]">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Set Up Your Profile</h3>
                    <p>Complete your company profile—logo, business info, and preferences.</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="text-4xl font-bold text-[#14B8A6]">3</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Create and Price Your Program</h3>
                    <p>
                      Build your course, define your schedule, and set an enrollment fee. You get paid when learners enroll.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="text-4xl font-bold text-[#14B8A6]">4</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Start Enrolling Learners</h3>
                    <p>
                      Your listing appears on the Prentis marketplace. Manage learners through your dashboard and message them directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-6">Earn on Your Terms</h2>
              <p className="mb-6 text-lg">
                Prentis makes monetization simple. Set your enrollment fee, get paid directly, and explore other income channels.
              </p>
              <ul className="flex flex-col font-semibold text-center text-lg list-disc list-inside mb-12">
                <li>💰 Direct course fees from learners</li>
                <li>📦 Add-ons: upsell materials or sessions</li>
                <li>🧠 Offer cohort-based training</li>
                <li>🎓 Long-term apprenticeships</li>
              </ul>
              <a
                href="/signup?type=recruiter"
                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold py-3 px-10 rounded-2xl transition"
              >
                Start Earning Now
              </a>
            </div>
          </section>
          <Footer />
      </div>
      </>
  )
}