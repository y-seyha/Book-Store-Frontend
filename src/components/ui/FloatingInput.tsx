"use client";

interface FloatingInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    className?: string;
}

export default function FloatingInput({
                                          label,
                                          value,
                                          onChange,
                                          type = "text",
                                          className = "",
                                      }: FloatingInputProps) {
    return (
        <div className={`relative w-full mt-4 ${className}`}>
            {/* Input */}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder=" "
                className="
                    peer w-full px-3 pt-5 pb-2 rounded-md border

                    bg-transparent

                    text-gray-900 dark:text-gray-100

                    border-gray-300 dark:border-gray-600
                    focus:border-indigo-500 dark:focus:border-indigo-400

                    focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20

                    outline-none
                    transition-all duration-200 ease-in-out

                    shadow-sm hover:shadow-md

                    placeholder-transparent
                "
            />

            {/* Label */}
            <label
                className="
    absolute left-3 px-0 z-10

    bg-white dark:bg-transparent

    text-gray-500 dark:text-gray-900

    transition-all duration-200 ease-in-out

    peer-placeholder-shown:top-4
    peer-placeholder-shown:text-base
    peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500

    peer-focus:-top-2.5
    peer-focus:text-xs
    peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400

    peer-not-placeholder-shown:-top-2.5
    peer-not-placeholder-shown:text-xs
    peer-not-placeholder-shown:text-indigo-600 dark:peer-not-placeholder-shown:text-indigo-400
"
            >
                {label}
            </label>
        </div>
    );
}