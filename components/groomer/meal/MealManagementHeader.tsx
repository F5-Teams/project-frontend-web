"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MealManagementHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function MealManagementHeader({
  date,
  onDateChange,
}: MealManagementHeaderProps) {
  return (
    <div className="flex items-center justify-end ">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-auto justify-start text-left font-poppins-light",
              !date && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4 font-poppins-light" />
            {date ? (
              format(date, "dd/MM/yyyy", { locale: vi })
            ) : (
              <span>Chọn ngày</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 ">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && onDateChange(newDate)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
