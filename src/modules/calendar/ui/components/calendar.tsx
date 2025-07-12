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
    <div className="w-full flex items-center justify-center my-4">
      <Container className="w-4/5 p-1 flex flex-col items-center justify-center">
        <div className="w-4/5 py-3 flex items-center justify-between">
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

        <div className="w-full flex items-center justify-center">
          <Carousel
            opts={{
              startIndex: today.getMonth(),
            }}
            setApi={(api) => setCarouselApi(api)}
            className="h-full w-full md:w-4/5"
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
            <CarouselPrevious className="hidden sm:block" />
            <CarouselNext className="hidden sm:block" />
          </Carousel>
        </div>
      </Container>
    </div>
  );
};

export default Calendar;
