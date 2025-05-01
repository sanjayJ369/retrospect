import Container from "@/components/ui/8bit/container";

const DateDisplay = () => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();

  const rowClasses = "flex w-full gap-1 flex-1";
  const cellClasses =
    "flex-1 p-1 sm:p-2 flex items-center justify-center bg-screen font-bold text-sm sm:text-xl md:text-2xl";

  return (
    <Container
      className="flex flex-col items-center justify-around p-1 sm:p-2 md:p-3 w-full max-w-xs
        gap-1 sm:gap-2 h-full mx-3"
    >
      <div className={rowClasses}>
        {day.split("").map((digit, i) => (
          <Container key={i} className={cellClasses}>
            {digit}
          </Container>
        ))}
      </div>

      <div className={rowClasses}>
        {month.split("").map((digit, i) => (
          <Container key={i} className={cellClasses}>
            {digit}
          </Container>
        ))}
      </div>

      <div className={rowClasses}>
        {year.split("").map((digit, i) => (
          <Container key={i} className={cellClasses}>
            {digit}
          </Container>
        ))}
      </div>
    </Container>
  );
};

export default DateDisplay;
