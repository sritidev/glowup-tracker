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
            className={`min-h-screen transition-colors duration-300 ${darkMode
                ? "bg-gray-900 text-white"
                : "bg-[#f7efe7] text-black"
                }`}
        >
            {/* TOAST */}
            {toast && (
                <div className="fixed top-0 left-0 w-full z-50">
                    <div className="mx-4 mt-4 bg-green-400 text-white py-3 rounded-xl text-center">
                        {toast}
                    </div>
                </div>
            )}


            {/* HEADER */}
            <div className="flex justify-between items-center max-w-6xl mx-auto px-4 pt-6">

                <p className="text-2xl text-pink-500 font-semibold">
                    Hello, Jenny
                </p>

                <Link
                    href="/history"
                    className="bg-pink-400 text-white px-4 py-2 rounded-xl text-sm"
                >
                    View History
                </Link>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                >
                    {darkMode ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>

            </div>


            {/* GRID */}
            <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">

                {/* LEFT */}
                <div>
                    <WeeklyPreview week={week} darkMode={darkMode} />
                </div>


                {/* CENTER */}
                <div>

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
                            className={`w-full py-3 rounded-xl font-semibold ${darkMode
                                    ? "bg-purple-600 text-white"
                                    : "bg-[#dab2ff7d] text-black"
                                }`}
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
                            className={`w-full py-3 rounded-xl ${darkMode
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-600 text-white"
                                }`}
                        >
                            Reset
                        </button>

                    </div>

                </div>


                {/* RIGHT */}
                <div>
                    <GlowStreak week={week} animate={animateStreak} darkMode={darkMode} />
                </div>

            </div>

        </main>
    );
}