import React from 'react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">PublishHub</div>
            <div>
              <Link href="/auth/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                  Login
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Publish Your Content to the World
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your books, comics, manga, and novels with readers worldwide
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Feature cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Easy Publishing</h3>
            <p>Upload and manage your content with simple tools</p>
          </div>
          {/* Add more feature cards */}
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
