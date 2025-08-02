export const Balance = ({ value }) => {
  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-IN")
      : "0";
  return (
    <div className="flex items-center" aria-label="balance">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">
        Rs {formattedValue}
      </div>
    </div>
  );
};
