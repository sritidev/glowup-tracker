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
    return (
        <main className="min-h-screen bg-[#f7efe7]">
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
        </main>
    )
}