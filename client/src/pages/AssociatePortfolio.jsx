import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const AssociatePortfolio = () => {
  const location = useLocation();
  const block = location.state;

  if (!block) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            No associate data found.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {/* Header Cover Image */}
      <div className="relative w-full h-80 md:h-[420px]">
        <img
          src={block.cover}
          alt={block.title}
          className="w-full h-full object-cover rounded-b-xl"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
          <img
            src={block.profile}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover bg-gray-200 mb-4"
          />
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            {block.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* Info + Tags */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap gap-4">
            {block.type && (
              <span className="bg-stone-100 text-stone-800 px-4 py-2 rounded-full text-sm font-medium">
                {block.type}
              </span>
            )}
            {block.location && (
              <span className="bg-stone-100 text-stone-800 px-4 py-2 rounded-full text-sm font-medium">
                {block.location}
              </span>
            )}
            {block.price && (
              <span className="bg-stone-100 text-stone-800 px-4 py-2 rounded-full text-sm font-medium">
                ₹{block.price}
              </span>
            )}
          </div>
          <p className="text-stone-700 text-base md:text-lg leading-relaxed">
            <span className="font-semibold">Bio: </span>
            {block.bio || "This is the bio of the associate. Add more details here."}
          </p>
        </div>

        {/* Portfolio Images */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {block.portfolioImages && block.portfolioImages.length > 0 ? (
              block.portfolioImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`portfolio-${idx}`}
                  className="w-full h-40 object-cover rounded-lg shadow"
                />
              ))
            ) : (
              [1, 2, 3].map((box) => (
                <div
                  key={box}
                  className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center bg-gray-50"
                >
                  <span className="text-gray-400">Add Image</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Work History */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            Work History
          </h2>
          {block.workHistory && block.workHistory.length > 0 ? (
            <ul className="space-y-4">
              {block.workHistory.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-stone-50 p-4 rounded-xl shadow-sm space-y-1"
                >
                  <div className="font-bold text-stone-800 text-lg">
                    {item.role}
                  </div>
                  <div className="text-stone-700">{item.company}</div>
                  <div className="text-stone-500 text-sm">{item.duration}</div>
                  <div className="mt-1 text-stone-600 text-sm">
                    {item.description}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-stone-500">No work history available.</div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AssociatePortfolio;
