import { useState, useEffect } from "react";
import { Monitor, X } from "lucide-react";

export const MobileWarning = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if screen width is less than 768px (md breakpoint)
    if (window.innerWidth < 768) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-teal-700/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-2">
            <Monitor className="w-6 h-6 text-teal-400" />
          </div>

          <h3 className="text-xl font-bold text-white">Desktop Recommended</h3>

          <p className="text-slate-300 text-sm leading-relaxed">
            For better performance and features, we encourage you to use a
            laptop or large screen.
          </p>

          <button
            onClick={() => setIsVisible(false)}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-teal-900/20 mt-2"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
