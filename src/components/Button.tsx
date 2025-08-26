"use client";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost";
};

export default function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "px-5 py-2 rounded-lg font-medium transition-colors",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "ghost" && "bg-transparent border border-gray-300 hover:bg-gray-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}