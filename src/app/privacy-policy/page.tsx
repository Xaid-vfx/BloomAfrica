import Footer from "@/components/Footer/Footer";
import GetStarted from "@/components/GetStartedBanner/GetStarted";
import Navbar from "@/components/navbar/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Policies | Prentis'
}

export default function PrivacyPolicy() {
    return (
        <div>
            <Navbar />
            <div className="py-20 px-6 lg:px-32">
                <h1 className="text-3xl font-medium text-center">Bloom Privacy Policy</h1>
                <p className="text-sm my-4 text-center ">Last Updated: 16th Aug, 2024</p>
                <p className="text-sm my-10">
                    Bloom respects and understands the importance of your privacy – and is therefore committed to affording complete protection to the personal information of our customers who use our products and services or visitors of our website, and of the learners whose information we may have access to and when you enroll on our website for an open position. It is in recognition of this need for security, compliance with the Nigeria Data Protection Act 2023 and Secured management of any information received /collected by us that Bloom has established this Privacy Policy. This privacy policy is applicable to our websites – www.prentis.ng and any services we provide. It also applies to our marketing practices. We ensure total transparency in all our dealings. Data Privacy is important to us and we strive to be transparent in our data collection and use practices.
                </p>
                <h2 className="font-medium text-xl mt-8">1. WHAT INFORMATION IS COLLECTED?</h2>
                <div className="text-sm flex flex-col">
                    <h3 className="font-medium text-lg mt-4">1.1 Personal Information Collected on Our Website</h3>
                    <p className="mt-2 mb-4">As a general practice, no personal information is collected about a visitor to the website, apart from the personal information submitted by the visitor himself/herself in a ‘contact us’ form. We shall use such Personal Information for the purpose you share it with us. However, at times, certain information may be collected from you when you visit the website. Such information is aggregated to measure the number of visits, average time spent on the website, pages viewed, etc. This gives us an idea of which parts of our website users are visiting, in order that we may improve the content to offer you better services. We do not link IP addresses to anything personally identifiable. This means that a user’s session will be tracked, but the user will be anonymous.</p>

                    <h3 className="font-medium text-lg mt-4">1.2 ID, Customer Information for Support and Maintenance</h3>
                    <p className="mt-2 mb-4">When you register to use Bloom, create an ID with us, or use our services for development or support, we collect information that is unique to you and identifies you. This may include your name, email address, phone number, or payment information, all in accordance with applicable law. Some information is required and other information is optional. Sometimes information regarding eligibility may be required. At times, we may rely on information from public sources.</p>

                    <h3 className="font-medium text-lg mt-4">1.3 Information Collected While Using Our Online Products and Applications</h3>
                    <p className="mt-2 mb-4">When our product/application is used, information may be collected on how it is used. We may collect information (like an IP address, or the type of device used) that your browser or device typically sends to our servers whenever you use our website, product, or application. We may use information that led you to our website – for example, the search terms used or the device being used – through cookies and similar technologies. Often, this information is anonymous and if associated with you, kept strictly confidential. If you do not want us to collect this information, you can tell us by opting out or by either declining or customizing cookie settings on our website.</p>

                    <h3 className="font-medium text-lg mt-4">1.4 Bloom Emails</h3>
                    <p className="mt-2 mb-4">We do contact organizations or executives as a part of our marketing campaigns. We do so, as we believe we have a legitimate interest in promoting our products and services, and it also benefits our prospects. We do not do any mass mailing and carefully reach out to selected professionals with a personalized approach. The emails we send you as part of our marketing campaigns allow us to know if you have received or opened the email, or clicked a link within the email. If you do not want us to collect this information from marketing emails, you can opt out of receiving such emails by clicking on the unsubscribe button.</p>

                    <h3 className="font-medium text-lg mt-4">1.5 Buttons or Tools on Our Websites Related to Other Companies and Social Media Pages</h3>
                    <p className="mt-2 mb-4">Our websites may include buttons or tools that link to other companies’ services (for example, a Facebook or Google button). We may collect information about your use of these features. In addition, when you see or interact with these buttons, tools, or content, or view a Bloom web page containing them, some information from your browser may automatically be sent to the other company. Please read that company’s privacy policy for more information, as these sites may have their own privacy statements in place, which we recommend you review if you visit any linked websites. We are not responsible for the content of linked sites or any use of the sites or for the privacy practices of those other websites. We may collect information when you interact with our social networking pages or use the sign-on features.</p>

                    <h3 className="font-medium text-lg mt-4">1.6 Hosted Services Provided by Bloom</h3>
                    <p className="mt-2 mb-4">We provide hosted services to many companies that may sometimes require the collection of information through cookies and other technology to collect analytic data required by the product and to understand our users and their likely interests. No information is collected without consent.</p>
                </div>

                <h2 className="font-medium text-xl mt-8">2. WHERE DO WE STORE THIS DATA?</h2>
                <div className="text-sm flex flex-col">
                    <p className="mt-2 mb-4">Information and data files are stored on our servers and the servers of companies we hire to provide services to us. We do not share, sell, or lease any kind of information collected to any third parties for their marketing uses.</p>
                </div>

                <h2 className="font-medium text-xl mt-8">3. HOW DO WE USE THE INFORMATION COLLECTED?</h2>
                <div className="text-sm flex flex-col">
                    <p className="mt-2 mb-4">We use this information to:</p>
                    <ul className="list-disc pl-6">
                        <li>Fulfill our contractual commitment and to enhance the performance of our contract with you.</li>
                        <li>Allow you to use our products and applications and respond to your requests.</li>
                        <li>Provide you with the services, support, or information requested and monitor the effectiveness.</li>
                        <li>Improve our website’s user experience and communicate better to engage users.</li>
                        <li>Enhance the effectiveness of our marketing campaigns. To send marketing emails or messages related to our products and services.</li>
                        <li>Monitor aggregate metrics to conduct our market research and understand our customers better.</li>
                        <li>Process your job application for an open position.</li>
                        <li>Analyze, diagnose and fix issues in our product and service offerings.</li>
                    </ul>
                    <p className="mt-4">In all cases, this information is not shared with any third party. It is used by Bloom as above or to prevent/respond to protection of our websites or applications. In some cases, like with hosted services, we may share information with those that provide us with technology services (e.g., web hosting and analytics services), but strictly for the purpose of carrying out our work. We may be required to share information with law enforcement or other third parties when compelled to do so by court order or other legal process, to comply with statutes or regulations.</p>
                </div>

                <h2 className="font-medium text-xl mt-8">4. HOW DO WE SECURE INFORMATION COLLECTED?</h2>
                <div className="text-sm flex flex-col">
                    <p className="mt-2 mb-4">We understand that the security of your information is vital and have in place strong administrative, technical, and physical security controls and measures to keep data safe and secure. Our privacy practices are designed to provide protection for your personal information, all over the world. To protect information stored on our servers, access is limited (through user/password credentials and two-factor authentication) to those employees who require it to perform their job functions. We use industry-standard Secure Socket Layer (SSL) encryption technology to safeguard the account registration process and sign-up information. Other security safeguards include but are not limited to multifactor authentication, data encryption, firewalls, and physical access controls to buildings and files.</p>
                </div>

                <h2 className="font-medium text-xl mt-8">5. CAN THIS INFORMATION BE REVIEWED?</h2>
                <div className="text-sm flex flex-col">
                    <p className="mt-2 mb-4">The Bloom website may, from time to time, contain links to and from the websites of our partner networks, advertisers, and affiliates (including, but not limited to, websites on which the Bloom website is advertised). If you follow a link to any of these websites, please note that these websites have their own privacy policies, and that Bloom does not accept any responsibility or liability for these policies. Please check these policies before you submit any personal data to these websites. We make all reasonable efforts to protect your data, but please note that we cannot guarantee the security of data transmitted to our site. Transmission is at your own risk. After we have received your information, we will use strict procedures and security features to try to prevent unauthorized access.</p>
                </div>
            </div>
            <GetStarted />
            <Footer />
        </div>
    );
}
