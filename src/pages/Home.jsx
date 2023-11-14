import React from 'react'
import {FaArrowRight} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HighlightText from '../components/cors/HomePage/HighlightText';
import CTAButton from '../components/cors/HomePage/Button';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/cors/HomePage/CodeBlocks';
import TimelineSection from '../components/cors/HomePage/TimelineSection';
import LearningLanguageSection from '../components/cors/HomePage/LearningLanguageSection';
import InstructorSection from '../components/cors/HomePage/InstructorSection'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/cors/HomePage/ExploreMore'
import ReviewSlider from '../components/common/ReviewSlider';

const Home = () => {
  return (
    <div>
        {/* Section1 */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white
        justify-between '>

            <Link to = '/signup'>

                <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                    <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>
            </Link>

            {/* Heading */}
            <div className='text-center text-4xl font-semibold mt-8'>
                Empower Your Future with
                <HighlightText text = {"Coding Skils"}/>
            </div>

            {/* Sub Heading */}
            <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>


            {/* CTA Buttons */}
            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>

                <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>
            </div>

            {/* Video */}
            <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
            <video
            muted
            loop
            autoPlay
            className="shadow-[20px_20px_rgba(255,255,255)]"
            >
            <source  src={Banner} type="video/mp4" />
            </video>
        </div>

            {/* Code section -1 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row"}
                    heading={
                        <div className='text-4xl font-semibold'>
                            Unlock Your
                            <HighlightText text={"coding potentials "}/>
                            with our online courses
                        </div>
                    }
                   subheading={
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                   }
                    ctabtn1 = {
                        {
                            btnText: "try it yourself",
                            linkto: "/signup",
                            active: true,
                        }
                    }

                    ctabtn2 = {
                        {
                            btnText: "Learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeColor={"text-yellow-25"}
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Hello, Mohd Sohail</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    backgroundGradient={<div className="codeblock1 absolute"></div>}
                />
            </div>

            {/* Code section -2 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row-reverse"}
                    heading={
                        <div className='text-4xl font-semibold'>
                            Start
                            <HighlightText text={"coding in seconds "}/>
                            
                        </div>
                    }
                   subheading={
                    "Go ahead give it a try. Our hands on learning enironment means you'll be writing real code fro your very first lesson."
                   }
                    ctabtn1 = {
                        {
                            btnText: "try it yourself",
                            linkto: "/signup",
                            active: true,
                        }
                    }

                    ctabtn2 = {
                        {
                            btnText: "Learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeColor={"text-brown-50"}
                    codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Sohail</div>\n)\n}\nexport default Home;`}
                    backgroundGradient={<div className="codeblock2 absolute"></div>}
                />
            </div>
                {/* Explore Section */}
                <ExploreMore />
        </div>
        {/* Section2 */}

        <div className='bg-pure-greys-5 text-richblack-700'>
            <div className='homepage_bg h-[320px]'>

                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
                    <div className='lg:h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white lg:mt-8'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-2' >
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                            
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn more
                            </div>
                        </CTAButton>
                    </div>

                </div>


            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8'>
                    {/* Job that is in Demand - Section 1 */}
                <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                    <div className='text-4xl font-semibold lg:w-[45%]'>
                        Get the Skills you need for a{" "}
                        <HighlightText text={"Job that is in demand."} />
                    </div>

                    <div className='flex flex-col gap-10 items-start lg:w-[40%]'>
                    <div className='text-[16px]'>
                    The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                    </CTAButton>
                    </div>

                </div>
                {/* Timeline Section - Section 2 */}
                <TimelineSection />

                {/* Learning Language Section - Section 3 */}
               <LearningLanguageSection />

            </div>     

      </div>


        {/* Section3 */}

        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
            {/* Become a instructor section */}
            <InstructorSection />

            <h2 className="text-center text-4xl font-semibold mt-8">Review from Others Learners</h2>
            {/* Review Slider here */}
            <ReviewSlider />
        </div>

        {/* Footer */}
        <Footer />
    </div>
  )
}

export default Home