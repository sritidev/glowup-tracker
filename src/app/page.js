import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="
        relative
        min-h-screen
        flex items-center justify-center
        px-4
        overflow-hidden

        bg-gradient-to-br
        from-pink-200
        via-purple-200
        to-pink-100

        dark:from-black
        dark:via-gray-900
        dark:to-black
      "
    >

      {/* animated blobs */}
      <div className="absolute w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-40 animate-pulse top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-40 animate-pulse bottom-10 right-10"></div>


      {/* phone style card */}
      <div
        className="
          w-full
          max-w-md

          rounded-[40px]

          p-6

          backdrop-blur-xl
          bg-white/70

          dark:bg-gray-900/70

          shadow-2xl
          border border-white/40

          text-center

          animate-[float_4s_ease-in-out_infinite]
        "
      >

        {/* logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/selfcare.png"
            alt="logo"
            width={120}
            height={40}
            className="dark:invert"
          />
        </div>


        {/* title */}
        <h1
          className="
            text-3xl
            font-bold

            bg-gradient-to-r
            from-pink-500
            to-purple-500

            bg-clip-text
            text-transparent
          "
        >
          Glow Up Tracker
        </h1>


        <p
          className="
            mt-2
            text-sm
            text-gray-600
            dark:text-gray-300
          "
        >
          Track mood • Build habits • Glow daily ✨
        </p>


        {/* image */}
        <div className="mt-6 flex justify-center">
          <Image
            src="/selfcare.png"
            alt="selfcare"
            width={140}
            height={140}
            className="opacity-90 animate-bounce"
          />
        </div>


        {/* button */}
        <Link
          href="/dashboard"
          className="
            block
            mt-8

            py-4
            rounded-2xl

            bg-pink-500
            hover:bg-pink-600

            text-white
            font-semibold

            shadow-lg

            animate-pulse
            hover:animate-none

            transition
          "
        >
          Start Today
        </Link>


        {/* login */}
        <Link
          href="/dashboard"
          className="
            block
            mt-4
            text-xs
            uppercase

            text-gray-500
            dark:text-gray-400
          "
        >
          I already have an account
        </Link>

      </div>

    </main>
  );
}