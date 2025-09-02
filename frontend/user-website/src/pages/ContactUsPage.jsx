import React, {useEffect, useState} from 'react';
import Navbar from "../components/navbar/Navbar.jsx";
import Footer from "../components/footer/Footer.jsx";
import ContactUs from "../components/ContactUs/ContactUs.jsx";
import MapComponent from "../components/ContactUs/MapComponent.jsx";

const ContactUsPage = () => {

    const [scrollPosition, setScrollPosition] = useState(0);


    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <div className='bg-[#e9e3e3]'>
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>
            <div
                className="h-full w-full bg-[#e9e3e3]  bg-center text-white flex flex-col transition-opacity duration-500"
            >

                <br/>
                <br/>
                <br/>
                <br/>

                <br/>
                <div className="text-center mb-8">
                    <h2 className="text-[#F4952C] font-pacifico text-3xl ">Little Lanka Backers</h2>
                    <h3 className="text-black font-quicksand text-3xl font-semibold mt-2">
                        We Care About Our Customers <br /> Experience Too
                    </h3>
                </div>
                <MapComponent />

                
                <ContactUs/>



            </div>

            <div
                className=" w-full bg-[#e9e3e3]  bg-center text-white flex flex-col transition-opacity duration-500"
            >


                <Footer/>

            </div>
        </div>
    );
};

export default ContactUsPage;