import Image from 'next/image'; // to handle images
import Link from 'next/link';

const page = () => {
    // Sample dishes
    const dishes = [
        { name: 'Momo', description: 'Nepali dumplings filled with meat or vegetables' },
        { name: 'Sel Roti', description: 'Traditional Nepali sweet rice donut' },
        { name: 'Dal Bhat', description: 'Lentil soup with rice, a classic Nepali dish' },
        { name: 'Chatamari', description: 'Rice flour pancake with toppings' },
    ];

    // Random image URL for restaurant surroundings
    const randomImage = 'https://source.unsplash.com/random/800x600/?restaurant,nepal';

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-black text-white p-4">
                <div className="container mx-auto flex justify-between">
                    <Link href="/" className="font-bold text-xl">Lisi Restaurant</Link>
                    <div className="flex gap-4">
                        <Link href="/" className="hover:underline">Home</Link>
                        <Link href="/about" className="hover:underline">About</Link>
                        <Link href="/contact" className="hover:underline">Contact</Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-10 px-4">
                <div className="container mx-auto">
                    {/* About Section */}
                    <section className="mb-10">
                        <h1 className="text-4xl font-bold text-center mb-4">Welcome to Lisi Restaurant</h1>
                        <p className="text-xl text-center mb-4">
                            Lisi is a popular restaurant located in the heart of Taudaha, Kirtipur. Known for its delicious and authentic Nepali dishes, 
                            it’s the best place to experience local flavors and cozy ambiance.
                        </p>
                        <p className="text-lg text-center mb-4">
                            Whether you're craving momo, sel roti, or dal bhat, Lisi offers a wide variety of traditional dishes that will leave you wanting more!
                        </p>
                    </section>

                    {/* Surrounding Area Image */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-center mb-4">The Surroundings</h2>
                        <div className="flex justify-center mb-6">
                            <Image 
                                src={randomImage} 
                                alt="Restaurant surroundings" 
                                width={800} 
                                height={600} 
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <p className="text-center text-lg">
                            Located in Kirtipur, the restaurant is surrounded by beautiful natural landscapes. It's a perfect spot to relax and enjoy great food.
                        </p>
                    </section>

                    {/* Dishes Section */}
                    <section>
                        <h2 className="text-2xl font-semibold text-center mb-4">Our Delicious Dishes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {dishes.map((dish, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                                    <p className="text-gray-600">{dish.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 Lisi Restaurant. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Link href="#" className="hover:underline">Privacy Policy</Link>
                        <Link href="#" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default page;
