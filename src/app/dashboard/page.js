"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import DailyCheckInCard from "../components/mood/DailyCheckInCard";
import MoodSelector from "../components/mood/MoodSelector";
import DailySummary from "../components/DailySummary";
import GlowStreak from "../components/GlowStreak";
import WeeklyPreview from "../components/WeeklyPreview";
import { Moon, Sun } from "lucide-react";

export default function Dashboard() {

    const [selectMood, setSelectMood] = useState(null);
    const [hydration, setHydration] = useState(null);
    const [movement, setMovement] = useState(null);
    const [energy, setEnergy] = useState(null);
    const [toast, setToast] = useState("");
    const [animateStreak, setAnimateStreak] = useState(false);
    const [darkMode, setDarkMode] = useState(false);



    const [week, setWeek] = useState([
        { day: "Mon", mood: null },
        { day: "Tue", mood: null },
        { day: "Wed", mood: null },
        { day: "Thu", mood: null },
        { day: "Fri", mood: null },
        { day: "Sat", mood: null },
        { day: "Sun", mood: null },
    ]);


    
    useEffect(() => {

        const savedWeek = localStorage.getItem("week");
        const lastSave = localStorage.getItem("lastSaveDate");

        const today = new Date().getDay(); 

        if (savedWeek && today !== 1) {
            setWeek(JSON.parse(savedWeek));
        }

    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("darkMode");
      
        if (saved === "true") {
          setDarkMode(true);
          document.documentElement.classList.add("dark");
        }
      }, []);
      
      useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
      
        if (darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }, [darkMode]);


    // ✅ SAVE FUNCTION (FIXED)
    const handleSave = () => {

        if (!selectMood || !hydration || !movement || !energy) {
            setToast("Please complete all sections first 💭");
            return;
        }

        const today = new Date().getDay();
        const adjustedIndex = today === 0 ? 6 : today - 1;

        const updatedWeek = [...week];

        updatedWeek[adjustedIndex].mood = selectMood.emoji;

        setWeek(updatedWeek);

        // save week
        localStorage.setItem("week", JSON.stringify(updatedWeek));


        localStorage.setItem(
            "lastSaveDate",
            new Date().toDateString()
        );

        setAnimateStreak(true);

        setTimeout(() => {
            setAnimateStreak(false);
        }, 600);

        setToast("Saved 💖");
    };


    return (

        <main
  className={`relative min-h-screen transition-colors duration-500 overflow-hidden
  ${darkMode ? "bg-gray-900 text-white" : "bg-[#f7efe7] text-black"}
`}
>

{/* floating glow blobs */}
<div className="absolute w-72 h-72 bg-pink-300 opacity-30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
<div className="absolute w-72 h-72 bg-purple-300 opacity-30 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>


{/* TOAST */}
{toast && (
  <div className="fixed top-0 left-0 w-full z-50 flex justify-center animate-slideDown">
    <div className="mt-4 bg-green-400 text-white px-6 py-3 rounded-xl shadow-lg">
      {toast}
    </div>
  </div>
)}


{/* HEADER */}
<div className="flex justify-between items-center max-w-6xl mx-auto px-4 pt-6">

  <p className="text-2xl text-pink-500 font-semibold">
    Hello, Jenny
  </p>

  <div className="flex items-center gap-3">

    <Link
      href="/history"
      className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-sm transition"
    >
      View History
    </Link>

    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
    >
      {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
    </button>

  </div>

</div>


{/* GRID */}
<div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">

{/* LEFT */}
<div className="animate-slideUp">
  <WeeklyPreview week={week} darkMode={darkMode} />
</div>


{/* CENTER */}
<div className="space-y-6 animate-slideUp delay-100">

  <MoodSelector
    selectMood={selectMood}
    setSelectMood={setSelectMood}
    darkMode={darkMode}
  />

  <DailyCheckInCard
    hydration={hydration}
    setHydration={setHydration}
    movement={movement}
    setMovement={setMovement}
    energy={energy}
    setEnergy={setEnergy}
    darkMode={darkMode}
  />

  <DailySummary
    selectMood={selectMood}
    hydration={hydration}
    movement={movement}
    energy={energy}
    darkMode={darkMode}
  />


  <div className="flex gap-4 mt-6">

    <button
      onClick={handleSave}
      className={`w-full py-3 rounded-xl font-semibold transition
      ${darkMode
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : "bg-[#dab2ff7d] hover:bg-[#d29cff] text-black"}
      `}
    >
      Save Today’s Log
    </button>

    <button
      onClick={() => {
        setSelectMood(null);
        setHydration(null);
        setMovement(null);
        setEnergy(null);
      }}
      className={`w-full py-3 rounded-xl transition
      ${darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white"
        : "bg-gray-600 hover:bg-gray-500 text-white"}
      `}
    >
      Reset
    </button>

  </div>

</div>


{/* RIGHT */}
<div className="animate-slideUp delay-200">
  <GlowStreak
    week={week}
    animate={animateStreak}
    darkMode={darkMode}
  />
</div>

</div>

</main>
    );
}