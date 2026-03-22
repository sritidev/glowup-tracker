"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import DailyCheckInCard from "../components/mood/DailyCheckInCard";
import MoodSelector from "../components/mood/MoodSelector";
import DailySummary from "../components/DailySummary";
import GlowStreak from "../components/GlowStreak";
import WeeklyPreview from "../components/WeeklyPreview";

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


    // ✅ Load saved week on start
    useEffect(() => {

        const savedWeek = localStorage.getItem("week");
        const lastSave = localStorage.getItem("lastSaveDate");
    
        const today = new Date().getDay(); // 1 = Monday
    
        if (savedWeek && today !== 1) {
            setWeek(JSON.parse(savedWeek));
        }
    
    }, []);

    useEffect(() => {

        const savedMode =
            localStorage.getItem("darkMode");
    
        if (savedMode === "true") {
            setDarkMode(true);
        }
    
    }, []);

    useEffect(() => {

        localStorage.setItem(
            "darkMode",
            darkMode
        );
    
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
        <main className="min-h-screen bg-[#f7efe7]">

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
                            className="w-full bg-[#dab2ff7d] hover:bg-pink-500 text-white font-semibold py-3 rounded-xl"
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
                            className="w-full bg-gray-600 text-white py-3 rounded-xl"
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