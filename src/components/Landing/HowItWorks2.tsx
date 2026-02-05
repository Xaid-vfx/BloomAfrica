import Image from 'next/image'
import quarter from '../../assets/images/SideCircle.png'
import image from '../../assets/images/h11 1.png'
import check from '../../assets/images/check.png'

export default function HowItWorks2() {
    return (
        <div className="bg-[#F0F0FB] py-10 px-4 relative lg:py-10 lg:block hidden">
            <Image src={quarter} alt="quarter" width={200} className="absolute bottom-0 left-0 hidden lg:block rotate-180" />
            <div className='flex px-20 items-center justify-around'>
                <Image src={image} alt='' width={600} />
                <div className='w-[45%]'>
                    <h1 className='text-3xl font-medium w-4/5'>Get the job that’s right for you</h1>
                    <p className='text-sm my-2 flex items-center gap-2'>
                        <Image src={check} alt='check' width={15} />Access to millions of apprenticeship opportunities</p>
                    <p className='text-sm my-2 flex items-center gap-2'>
                        <Image src={check} alt='check' width={15} />Unlock your career potential through industry connections</p>
                    <p className='text-sm my-2 flex items-center gap-2'>
                        <Image src={check} alt='check' width={15} />Facilitates faster professional development and career advancement.</p>
                    <p className='text-sm my-2 flex items-center gap-2'>
                        <Image src={check} alt='check' width={15} />Prentis Apprenticeship facilitates hands-on learning experiences.</p>
                    <p className='text-sm my-2 flex items-center gap-2'>
                        <Image src={check} alt='check' width={15} />Offers a convenient and accessible online environment for users.</p>

                    <button className='px-10 py-3 border border-[#14B8A6] text-xs rounded-full font-medium text-[#14B8A6] mt-6'>Join Waitlist {'>'}</button>

                </div>
            </div>
        </div>
    )
}