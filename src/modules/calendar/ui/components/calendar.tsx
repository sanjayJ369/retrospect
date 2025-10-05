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
import { useEffect, useMemo, useState } from "react";
import CalendarMonth from "./calendar-month";
import CalendarMonthCard from "./calendar-month-card";
import { useCalendarYearQuery } from "@/hooks/api/calendar/useCalendarYearQuery";
import { CalendarYear as CalendarYearType } from "@/types/calendar";
import CalendarYear from "./calendar-year";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

const Calendar = () => {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const { data: yearData, isLoading, isError } = useCalendarYearQuery(year);

  const normalizedYearData = useMemo<CalendarYearType>(() => {
    const defaultData: CalendarYearType = {
      year: year,
      months: [],
    };

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const daysInMonth = getDaysInMonth(year, monthIndex);
      const defaultDays = Array.from(
        { length: daysInMonth },
        (_, dayIndex) => ({
          day: dayIndex + 1,
          score: 0,
        }),
      );

      defaultData.months.push({
        month: monthIndex + 1,
        days: defaultDays,
      });
    }

    if (yearData?.months) {
      const apiMonthsMap = new Map(yearData.months.map((m) => [m.month, m]));

      defaultData.months.forEach((defaultMonth, index) => {
        if (apiMonthsMap.has(defaultMonth.month)) {
          defaultData.months[index] = apiMonthsMap.get(defaultMonth.month)!;
        }
      });
    }

    return defaultData;
  }, [year, yearData]);

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
  if (isError) return <p>Error...</p>;

  return (
    <div className="w-full flex items-center justify-center my-4">
      <Container className="w-4/5 p-1 flex flex-col items-center justify-center">
        <div className="w-4/5 py-3 flex items-center justify-between">
          <CalendarYear setYear={setYear} year={year} />
          <CalendarMonth
            setMonth={(m) => carouselApi?.scrollTo(m)}
            month={month}
          />
        </div>

        <div className="w-full flex items-center justify-center">
          <Carousel
            opts={{ startIndex: month }}
            setApi={setCarouselApi}
            className="h-full w-full md:w-4/5"
          >
            <CarouselContent className="h-full transition-transform duration-300 ease-in-out">
              {normalizedYearData.months.map((monthData, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="p-1 sm:p-2 md:p-3 h-full ml-2">
                    <CalendarMonthCard monthData={monthData} />
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
