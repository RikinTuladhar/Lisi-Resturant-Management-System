import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Taudaha Delight - Premier Dining in Kirtipur" />

            {/* Hero Section */}
            <section
                className="relative h-screen bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative flex flex-col items-center justify-center h-full text-white text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">Taudaha Delight</h1>
                    <p className="text-xl md:text-2xl mb-8">Experience culinary excellence in the heart of Taudaha, Kirtipur</p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300">
                        Reserve a Table
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">About Taudaha Delight</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        Nestled in the serene locale of Taudaha, Kirtipur, Taudaha Delight is the premier dining destination
                        renowned for its modern elegance and unparalleled service. Our restaurant blends contemporary design
                        with warm hospitality, creating an inviting atmosphere that elevates every dining experience.
                    </p>
                </div>
            </section>

            {/* Menu Highlights */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Menu Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Signature Momo",
                                description: "Juicy dumplings filled with local spices, served with a tangy sauce.",
                                img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
                            },
                            {
                                title: "Grilled Platter",
                                description: "A medley of grilled meats and vegetables, bursting with flavor.",
                                img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
                            },
                            {
                                title: "Dessert Delight",
                                description: "Indulgent local sweets crafted to perfection.",
                                img: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
                            },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-amber-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Impeccable Service",
                                desc: "Our attentive staff ensures a seamless dining experience, tailored to your needs.",
                            },
                            {
                                title: "Modern Ambiance",
                                desc: "Sleek interiors and stunning views of Taudaha create a perfect dining atmosphere.",
                            },
                            {
                                title: "Event Hosting",
                                desc: "Host your special occasions with us in our beautifully designed private spaces.",
                            },
                        ].map((s, i) => (
                            <div key={i}>
                                <h3 className="text-2xl text-black font-semibold mb-4">{s.title}</h3>
                                <p className="text-gray-600">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gray-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Visit Us</h2>
                    <p className="text-lg mb-4">Taudaha, Kirtipur, Nepal</p>
                    <p className="text-lg mb-4">Phone: +977 1-2345678</p>
                    <p className="text-lg mb-8">Email: info@taudahadelight.com</p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300">
                        Contact Us
                    </button>
                </div>
            </section>
        </>
    );
}
