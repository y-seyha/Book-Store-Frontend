"use client";

import MainLayout from "@/components/layout/MainLayout";

export default function AboutPage() {
    return (
        <MainLayout>
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-16 mt-16">

                {/* Header */}
                <h1 className="mb-4 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 text-center tracking-tight leading-tight max-w-3xl mx-auto drop-shadow-lg">
                    About Our Bookstore
                </h1>

                {/* Intro */}
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
                    Welcome to our bookstore! We are passionate about connecting readers
                    with the books they love. Whether you're searching for the latest
                    bestseller, a classic novel, or a unique gift, our store is the perfect
                    destination for every book lover.
                </p>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 justify-items-center mt-8">
                    <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-md w-full">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Our Mission
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                            Our mission is to inspire a love of reading by providing a
                            carefully curated selection of books, personalized
                            recommendations, and a welcoming community for readers of all ages.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-md w-full">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Our Vision
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                            We aim to become a go-to destination for book enthusiasts,
                            fostering a world where everyone can discover stories that
                            enlighten, entertain, and empower.
                        </p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="flex flex-col gap-8 items-center mt-8">
                    <div className="max-w-4xl w-full flex flex-col gap-4">
                        <h2 className=" mb-10 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                            Why Choose Us?
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Feature Cards */}
                            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 md:p-5 rounded-lg text-center shadow-md text-sm md:text-base text-gray-800 dark:text-gray-200">
                                Wide variety of books across all genres
                            </div>
                            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 md:p-5 rounded-lg text-center shadow-md text-sm md:text-base text-gray-800 dark:text-gray-200">
                                Curated recommendations from book experts
                            </div>
                            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 md:p-5 rounded-lg text-center shadow-md text-sm md:text-base text-gray-800 dark:text-gray-200">
                                Friendly, knowledgeable staff always ready to help
                            </div>
                            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 md:p-5 rounded-lg text-center shadow-md text-sm md:text-base text-gray-800 dark:text-gray-200">
                                Easy online ordering and fast delivery
                            </div>
                            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 md:p-5 rounded-lg text-center shadow-md text-sm md:text-base text-gray-800 dark:text-gray-200">
                                Community events, book clubs, and author signings
                            </div>
                            <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 md:p-5 rounded-lg text-center shadow-md text-sm md:text-base text-gray-800 dark:text-gray-200">
                                Exclusive member discounts and rewards
                            </div>
                        </div>
                    </div>

                    {/* Team Image */}
                    <div className="text-center max-w-4xl w-full mt-20">
                        <img
                            src="/readers.jpg"
                            alt="Our Bookstore Team"
                            className="mx-auto rounded-3xl shadow-2xl max-w-full h-auto border-2 md:border-4 border-indigo-200 dark:border-indigo-700 transition-transform transform hover:scale-105 duration-300"
                        />
                        <p className="mt-6 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                            Our passionate team is dedicated to bringing you the best reading experience.
                        </p>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}