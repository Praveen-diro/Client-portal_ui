import React from "react";
import { useTheme } from "next-themes";

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className = "" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      className={`
        group
        relative flex h-10 w-32 items-center justify-center gap-2
        rounded-md transition-all overflow-hidden
        duration-300 ease-in-out cursor-pointer 
        font-medium text-sm
        ${isDark ? "bg-[#111827] text-white" : "bg-white text-gray-800"}
        border ${isDark ? "border-gray-700" : "border-gray-200"}
        shadow-sm
        hover:shadow-md
        hover:translate-y-[-2px]
        ${isDark ? "hover:bg-gray-800 hover:border-gray-700" : "hover:bg-gray-50 hover:border-gray-300"}
        focus:outline-none focus:ring-2 ${isDark ? "focus:ring-gray-700" : "focus:ring-gray-200"}
        active:translate-y-[-1px] active:shadow-sm
        ${className}
      `}
      aria-label="Go back"
    >
      <svg
        height="16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 1024 1024"
        className="relative transition-transform duration-300 ease-out 
                 group-hover:translate-x-[-4px]"
      >
        <path
          d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"
          className={`${isDark ? "fill-white" : "fill-gray-800"}`}
        />
      </svg>
      <span>Back</span>
    </button>
  );
};

export default BackButton;
