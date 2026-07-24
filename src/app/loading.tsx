export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer glowing ring */}
        <div 
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent animate-spin"
          style={{ 
            borderColor: "var(--primary)",
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
            animationDuration: "1.5s" 
          }}
        />
        {/* Inner pulsing circle */}
        <div 
          className="w-8 h-8 rounded-full animate-pulse"
          style={{ 
            background: "var(--primary)",
            opacity: 0.8
          }}
        />
      </div>
      <p 
        className="mt-6 text-sm font-medium tracking-widest uppercase animate-pulse"
        style={{ color: "var(--primary)", fontFamily: "'Cinzel', serif" }}
      >
        Loading...
      </p>
    </div>
  );
}
