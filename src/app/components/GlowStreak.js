import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function GlowStreak({ week, animate }) {

    const totalDays = 7;

    const streak =
        week.filter(day => day.mood !== null).length;

    useEffect(() => {

        if (streak === 7) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
            });
        }

    }, [streak]);

    return (
        <div className="p-6 bg-white rounded-xl text-center">

            <p>🔥 Glow Streak</p>

            <h2
                className={`text-5xl font-bold transition-transform duration-300 ${
                    animate ? "scale-125 text-pink-600" : ""
                }`}
            >
                {streak} Days
            </h2>

        </div>
    );
}