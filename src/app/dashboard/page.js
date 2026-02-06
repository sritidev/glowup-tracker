"use client"
import { useState } from "react"
import DailyCheckInCard from "../components/mood/DailyCheckInCard";
import MoodSelector from "../components/mood/MoodSelector";
import DailySummary from "../components/DailySummary";

export default function Dashboard() {
    const [selectMood, setSelectMood] = useState(null);
    const [hydration, setHydration] = useState(null);
    const [movement, setMovement] = useState(null);
    const [energy, setEnergy] = useState(null);
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState("");


    const handleSave = () => {
        if (!selectMood || !hydration || !movement || !energy) {
            setToast("Please complete all sections first 💭");

              setTimeout(() => {
                setToast("");
              }, 9000);

            return;
        }

        setToast("Your glow-up log is saved for today 💖");

        setTimeout(() => {
            setToast("");
        }, 3000);
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
            <div className="max-w-md mx-auto mt-6 px-4 text-center">
                <button
                    onClick={handleSave}
                    className="w-full bg-[#dab2ff7d] hover:bg-pink-500 text-white font-semibold py-3 rounded-2xl shadow-md transition"
                >
                    Save Today’s Log 💾
                </button>

            </div>
        </main>
    )
}