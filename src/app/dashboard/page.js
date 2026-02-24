"use client"
import { useState } from "react"
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
    const [week, setWeek] = useState([
        { day: "Mon", mood: null },
        { day: "Tue", mood: null },
        { day: "Wed", mood: null },
        { day: "Thu", mood: null },
        { day: "Fri", mood: null },
        { day: "Sat", mood: null },
        { day: "Sun", mood: null },
    ]);


    const handleSave = () => {
        if (!selectMood || !hydration || !movement || !energy) {
            setToast("Please complete all sections first 💭");
            setTimeout(() => setToast(""), 3000);
            return;
        }

        // 🔥 STEP 1: Get today's day index
    const today = new Date().getDay(); 
    // 0 = Sunday
    // 1 = Monday
    // ...
    // 6 = Saturday

    // 🔥 STEP 2: Convert Sunday-first index to your Monday-first array
    const adjustedIndex = today === 0 ? 6 : today - 1;

    // 🔥 STEP 3: Copy week array (never mutate directly)
    const updatedWeek = [...week];

    // 🔥 STEP 4: Update today's mood
    updatedWeek[adjustedIndex].mood = selectMood.emoji;

    // 🔥 STEP 5: Save updated week to state
    setWeek(updatedWeek);

    setToast("Your glow-up log is saved for today 💖");
    setTimeout(() => setToast(""), 3000);
};


    return (
        <main className="min-h-screen bg-[#f7efe7]">
            {toast && (
                <div className="fixed top-0 left-0 w-full z-50 animate-slideDown">
                    <div className="mx-4 mt-4 bg-green-400 text-white py-3 rounded-xl shadow-lg text-xs font-medium text-center">
                        {toast}
                    </div>
                </div>
            )}
            <div className="max-w-md mx-auto px-4">
                <p className="text-2xl mt-6 pt-6 text-pink-500 font-semi-bold">Hello, Jenny</p>
            </div>
            <div className="grid md:grid-cols-2">
                <WeeklyPreview week={week} />
                <GlowStreak week={week} setWeek={setWeek} />
            </div>

            <MoodSelector selectMood={selectMood} setSelectMood={setSelectMood} />
            <DailyCheckInCard
                hydration={hydration}
                setHydration={setHydration}
                movement={movement}
                setMovement={setMovement}
                energy={energy}
                setEnergy={setEnergy}
            />
            <DailySummary
                selectMood={selectMood}
                hydration={hydration}
                movement={movement}
                energy={energy}
            />

            <div className="max-w-md mx-auto flex justify-around gap-4 mt-6 mb-4 px-4 text-center">
                <button
                    onClick={handleSave}
                    className="w-full bg-[#dab2ff7d] hover:bg-pink-500 text-white font-semibold py-3 rounded-xl shadow-md transition"
                >
                    Save Today’s Log
                </button>
                <button
                    onClick={() => {
                        setSelectMood(null);
                        setHydration(null);
                        setMovement(null);
                        setEnergy(null);
                    }
                    }
                    className="w-full bg-gray-600 hover:bg-pink-500 text-white font-semibold py-3 rounded-xl shadow-md transition"
                >
                    Reset
                </button>

            </div>
        </main>
    )
}