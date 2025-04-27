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
import { getStorageProvider } from "@/lib/storage/StorageProvider";
import CalendarMonthCard from "./calendar-month-card";
import { usePromiseQuery } from "@/hooks/usePromisQuery";

const Calendar = () => {
  const today = new Date();
  const storage = getStorageProvider();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const {
    data: yearData,
    isLoading,
    isError,
  } = usePromiseQuery(() => storage.getCalendarYear(year), [year]);

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
    <Container className="flex flex-col p-3 m-3 justify-center items-center">
      <div className="flex flex-col w-full gap-3 justify-center items-center">
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

      <div className="w-11/12">
        <Carousel
          opts={{
            startIndex: today.getMonth(),
          }}
          setApi={(api) => setCarouselApi(api)}
        >
          <CarouselContent>
            {months.map((m) => (
              <CarouselItem key={m}>
                <div className="p-3">
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
