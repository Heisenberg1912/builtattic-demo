import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import hero_img from "/src/assets/home/hero_img.jpg";
import banner1 from "/src/assets/home/banner1.jpg";
import banner2 from "/src/assets/home/banner2.jpg";
import banner3 from "/src/assets/home/banner3.png";
import banner4 from "/src/assets/home/banner4.png";
// import circle images
import ultratech_cement from "/src/assets/home/ultratech_cement.webp";
import redbricks from "/src/assets/home/redbricks.jpg";
import riversand from "/src/assets/home/riversand.jpeg";
import tmt_steelbar from "/src/assets/home/tmt_steelbar.jpeg";
import ceramic_floor_tile from "/src/assets/home/ceramic_floor_tile.jpeg";
import paints from "/src/assets/home/paints.webp";
import timber_plank from "/src/assets/home/timber_plank.jpeg";
import tempered_glass from "/src/assets/home/tempered_glass.jpeg";
import RegistrStrip from "../components/registrstrip";

const HomePage = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Animation variants for reusability
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const circleMaterials = useMemo(
    () => [
      {
        name: "Cement",
        images: [
          ultratech_cement,
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=200&q=60",
        ],
      },
      {
        name: "Bricks",
        images: [
          redbricks,
          "https://images.unsplash.com/photo-1600607687920-4e2a9c24c2e9?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=60",
        ],
      },
      {
        name: "Steel",
        images: [
          tmt_steelbar,
          "https://images.unsplash.com/photo-1582719478250-6c8f9b89e0ee?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1503387762-a6f0b2f60772?auto=format&fit=crop&w=200&q=60",
        ],
      },
      {
        name: "Tiles",
        images: [
          ceramic_floor_tile,
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=200&q=60",
        ],
      },
      {
        name: "Wood",
        images: [
          timber_plank,
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1582719478250-53999edee20e?auto=format&fit=crop&w=200&q=60",
        ],
      },
      {
        name: "Paints",
        images: [
          paints,
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=200&q=60",
        ],
      },
      {
        name: "Glass",
        images: [
          tempered_glass,
          "https://images.unsplash.com/photo-1503387762-a6f0b2f60772?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=60",
        ],
      },
      {
        name: "Sand",
        images: [
          riversand,
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=60",
          "https://images.unsplash.com/photo-1455218873509-8097305ee378?auto=format&fit=crop&w=200&q=60",
        ],
      },
    ],
    []
  );

  const CircleItem = ({ item }) => {
    const { name, images } = item;
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    const stopLoop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const startLoop = () => {
      if (images.length <= 1 || intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 700);
    };

    useEffect(() => () => stopLoop(), []);

    return (
      <motion.div
        variants={fadeUp}
        className="flex flex-col items-center"
        onMouseEnter={startLoop}
        onMouseLeave={() => {
          stopLoop();
          setIndex(0);
        }}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-md mb-2 bg-white flex items-center justify-center">
          <img
            src={images[index]}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </motion.div>
    );
  };
  return (
    <>
      <RegistrStrip />
      <div className="bg-white text-gray-900 overflow-x-hidden">
        {/* Hero Section with home image */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // keeps aspect ratio like 16:9
          }}
        >
          {/* Image */}
          <motion.img
            src={hero_img}
            alt="Preview"
            variants={scaleIn}
            whileHover={{ scale: 1.02 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              border: "none",
            }}
          />

          {/* Text Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-5"
            style={{
              position: "absolute",
              top: "5%",
              left: "40%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              Journey Begins
            </h1>
            <p
              style={{
                marginTop: "10px",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
            >
              The journery starts this very <br /> minute. Know what it is
              about.
            </p>
            <button className="bg-white text-gray-800 px-6 py-2 rounded-full shadow-md font-bold hover:bg-gray-100 hover:shadow-lg transition-all duration-300 mt-8">
              Watch the film
            </button>
          </motion.div>
        </motion.section>

        {/* GIF + Search Section */}
        <div className="relative w-full h-screen flex items-center justify-center px-4 text-center">
          {/* GIF Background with reduced opacity */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url('https://media.giphy.com/media/UzVAgtxx7DBra/giphy.gif')`,
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative bg-black/60 p-8 rounded-xl shadow-lg max-w-3xl w-full">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-4">
              What are you looking for?
            </h2>

            {/* Description */}
            <p className="text-gray-200 text-lg mb-6 max-w-md mx-auto">
              Discover everything you need from top-quality materials to
              trending products, all in one place.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center mb-6 w-full max-w-md mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  className="w-full border text-white border-gray-300 rounded-full px-5 py-3 pr-12 shadow-md focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="absolute right-4 top-3.5 h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                  />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 justify-center">
              {["House", "Mall", "Shop", "Office", "Park", "Institution"].map(
                (item) => (
                  <button
                    key={item}
                    className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-full shadow hover:border-blue-300 transition"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <section className="min-h-screen w-full flex flex-col gap-3">
          {/* Top Row (2 banners) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Banner 1 */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden shadow-lg group">
              <img
                src={banner1}
                alt="Banner 1"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-3 inset-x-0 flex flex-col items-center text-center p-6">
                <h3 className="text-white text-3xl font-bold">
                  Architecture Capital
                </h3>
                <p className="text-white text-lg mb-3">
                  Designs from Copenhagen
                </p>
                <div className="flex gap-3">
                  <button className="px-5 py-2 text-sm bg-white text-gray-900 rounded-full font-semibold">
                    Read more
                  </button>
                  <button className="px-5 py-2 text-sm border border-white text-white rounded-full font-semibold">
                    Buy
                  </button>
                </div>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden shadow-lg group">
              <img
                src={banner2}
                alt="Banner 2"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-3 inset-x-0 flex flex-col items-center text-center p-6">
                <h3 className="text-white text-3xl font-bold">Sky High</h3>
                <p className="text-white text-lg mb-3">
                  Towering Heights and Cloudy Views
                </p>
                <div className="flex gap-3">
                  <button className="px-5 py-2 text-sm bg-white text-gray-900 rounded-full font-semibold">
                    Read more
                  </button>
                  <button className="px-5 py-2 text-sm border border-white text-white rounded-full font-semibold">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row (2 banners) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Banner 3 */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden shadow-lg group">
              <img
                src={banner3}
                alt="Banner 3"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-3 inset-x-0 flex flex-col items-center text-center p-6">
                <h4 className="text-white text-lg font-bold underline">
                  Firm of the Day
                </h4>
                <h3 className="text-white text-3xl font-bold">Studio Mosby</h3>
                <p className="text-white text-lg mb-3">
                  10% off on all designs
                </p>
                <div className="flex gap-3">
                  <button className="px-5 py-2 text-sm bg-white text-gray-900 rounded-full font-semibold">
                    Read more
                  </button>
                  <button className="px-5 py-2 text-sm border border-white text-white rounded-full font-semibold">
                    Buy
                  </button>
                </div>
              </div>
            </div>

            {/* Banner 4 */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden shadow-lg group">
              <img
                src={banner4}
                alt="Banner 4"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-3 inset-x-0 flex flex-col items-center text-center p-6">
                <h4 className="text-white text-lg font-bold underline">
                  Firm of the Week
                </h4>
                <h3 className="text-white text-3xl font-bold">
                  Hammer & Nails
                </h3>
                <p className="text-white text-lg mb-3">New Fall Collection</p>
                <div className="flex gap-3">
                  <button className="px-5 py-2 text-sm bg-white text-gray-900 rounded-full font-semibold">
                    Read more
                  </button>
                  <button className="px-5 py-2 text-sm border border-white text-white rounded-full font-semibold">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Circular Categories */}
        <section className="py-10">
          <motion.div
            className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {circleMaterials.map((item) => (
              <CircleItem key={item.name} item={item} />
            ))}
          </motion.div>
        </section>

        {/* Footer with fade in */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;
