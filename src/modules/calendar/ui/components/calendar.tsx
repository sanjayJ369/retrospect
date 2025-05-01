"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import Container from "@/components/ui/8bit/container";
import { useEffect, useState } from "react";
import CalendarYear from "./calendar-year";
import CalendarMonth from "./calendar-month";
import CalendarMonthCard from "./calendar-month-card";
import { useCalendarYearQuery } from "@/hooks/api/calendar/useCalendarYearQuery";

const Calendar = () => {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const { data: yearData, isLoading, isError } = useCalendarYearQuery(year);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      const selectedMonth = carouselApi.selectedScrollSnap();
      setMonth(selectedMonth);
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !yearData) return <p>Error...</p>;

  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Container className="flex flex-col p-1 sm:p-2 md:p-3 justify-center items-center h-full w-full">
      <div
        className="flex flex-col w-full gap-1 sm:gap-2 md:gap-3 justify-center items-center mb-2
          md:mb-3"
      >
        <div className="flex gap-2 w-full justify-center">
          <CalendarYear setYear={setYear} year={year} />
          <CalendarMonth
            setMonth={(m) => {
              if (carouselApi) {
                carouselApi.scrollTo(m);
              }
            }}
            month={month}
          />
        </div>
      </div>

      <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 flex-1 px-3">
        <Carousel
          opts={{
            startIndex: today.getMonth(),
          }}
          setApi={(api) => setCarouselApi(api)}
          className="h-full"
        >
          <CarouselContent className="h-full">
            {months.map((m) => (
              <CarouselItem key={m} className="h-full">
                <div className="p-1 sm:p-2 md:p-3 h-full">
                  <CalendarMonthCard monthData={yearData.months[m]} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </Container>
  );
};

export default Calendar;
