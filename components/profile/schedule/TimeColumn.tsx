"use client";

import * as React from "react";

type Props = { slots: string[]; rowHeight: number };

export const TimeColumn: React.FC<Props> = ({ slots, rowHeight }) => (
  <div className="relative" style={{ height: (slots.length - 1) * rowHeight }}>
    {slots.slice(0, -1).map((time, i) => (
      <div
        key={time}
        className="absolute text-sm font-poppins-light text-gray-500"
        style={{ top: `${i * rowHeight - 6}px` }}
      >
        {time}
      </div>
    ))}
  </div>
);
