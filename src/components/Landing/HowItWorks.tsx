import { CheckCircle, Code, Rocket } from "lucide-react"

export default function HowItWorks() {
    return (
        <div className="bg-grey-50 py-16 px-4 lg:py-24">
            <div className="ms-auto me-auto lg:max-w-[1500px] max-lg:max-w-[700px]">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-semibold lg:text-4xl text-grey-900">How It Works</h1>
                    <p className="text-base my-3 leading-6 px-6 lg:text-lg text-grey-600">
                        Join our fellowship in three simple steps
                    </p>
                </div>

                <div className="lg:flex lg:px-10 gap-8">
                    <div className="text-center my-6 flex flex-col items-center py-10 px-8 lg:w-1/3 bg-white border border-grey-200 rounded-xl hover:border-[#4A2C84] transition-colors">
                        <div className="text-[#4A2C84] mb-4">
                            <CheckCircle size={64} strokeWidth={1.5} />
                        </div>

                        <h2 className="my-3 font-medium text-xl text-grey-900">
                            Apply & Get Accepted
                        </h2>
                        <p className="text-sm leading-6 mt-3 text-grey-600 max-lg:max-w-[500px]">
                            Submit your application and complete our technical assessment. We select driven individuals ready to build real products and grow professionally.
                        </p>
                    </div>

                    <div className="text-center my-6 flex flex-col items-center py-10 px-8 lg:w-1/3 bg-white border border-grey-200 rounded-xl hover:border-[#4A2C84] transition-colors">
                        <div className="text-[#4A2C84] mb-4">
                            <Code size={64} strokeWidth={1.5} />
                        </div>

                        <h2 className="my-3 font-medium text-xl text-grey-900">
                            Train & Build
                        </h2>
                        <p className="text-sm leading-6 mt-3 text-grey-600 max-lg:max-w-[500px]">
                            Get embedded in an active startup. Follow our structured curriculum while building production features under expert mentorship from senior engineers.
                        </p>
                    </div>

                    <div className="text-center my-6 flex flex-col items-center py-10 px-8 lg:w-1/3 bg-white border border-grey-200 rounded-xl hover:border-[#4A2C84] transition-colors">
                        <div className="text-[#4A2C84] mb-4">
                            <Rocket size={64} strokeWidth={1.5} />
                        </div>

                        <h2 className="my-3 font-medium text-xl text-grey-900">
                            Launch Your Career
                        </h2>
                        <p className="text-sm leading-6 mt-3 text-grey-600 max-lg:max-w-[500px]">
                            Graduate with a verified portfolio of real products, startup experience, and technical certifications that companies value. 95% hired within 3 months.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
