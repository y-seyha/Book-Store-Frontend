"use client";

interface FloatingInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;       // allows text, email, password, etc.
    className?: string;  // additional classes from parent
}

export default function FloatingInput({
                                          label,
                                          value,
                                          onChange,
                                          type = "text",
                                          className = "",
                                      }: FloatingInputProps) {
    return (
        <div className={`relative mt-4 w-full ${className}`}>
            {/* Input */}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder=" "
                className="
          peer block w-full px-3 pt-5 pb-2 border rounded-md
          border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          focus:border-indigo-500 dark:focus:border-indigo-400
          focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400
          outline-none
          transition-all duration-200
          shadow-sm hover:shadow-md
        "
            />

            {/* Label */}
            <label
                className="
          absolute left-3 px-1 text-gray-500 dark:text-gray-400
          text-sm bg-white dark:bg-gray-800
          z-10
          transition-all duration-200
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500
          peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400
          peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-indigo-500 dark:peer-not-placeholder-shown:text-indigo-400
        "
            >
                {label}
            </label>
        </div>
    );
}