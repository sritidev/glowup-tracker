import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#dab2ff] p-4">
      <div className="flex items-center justify-center py-4">
        <Image
          className="dark:invert"
          src="/selfcare.png"
          alt="Self Care logo"
          width={100}
          height={20}
          priority
        />
      </div>
      <h1 className="text-center text-white text-2xl">Hi there,</h1>
      <h2 className="text-center text-white text-2xl">I'm Glow Up Tracker</h2>
      <p className="text-[#3a2d3087] text-center mt-5">
        Your new daily
      </p>
      <p className="text-[#3a2d3087] text-center mb-6">
        self-care companion ✨
      </p>
      <div className="action-buttons-triggers py-4">
        <div className="w-full max-w-sm bg-white text-center p-4 mb-8 rounded-3xl shadow-xl">
          <a href="#" className="text-sm/6 font-semi-bold mt-12  text-center mb-4">
            Hi, GLOWUP TRACKER
          </a>
        </div>
        <div className="flex items-center justify-center">
          <a href="#" className="text-gray-500 font-semi-bold text-center uppercase">
            I already have an account
          </a>
        </div>

      </div>

    </main>
  );
}
