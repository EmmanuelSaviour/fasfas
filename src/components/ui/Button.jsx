function Button({
  children,
  variant = "primary",
  onClick,
}) {
  const base =
    "px-6 py-3 rounded-xl font-semibold transition duration-300";

  const styles = {
    primary:
      "bg-white text-emerald-600 shadow-lg hover:scale-105",

    secondary:
      "border-2 border-white text-white hover:bg-white hover:text-emerald-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;