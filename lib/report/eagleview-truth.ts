/**
 * EagleView "Bid Perfect" ground truth extracted from customer-provided sample reports.
 * Used as calibration benchmark for the measurement pipeline.
 */
export type EagleViewSample = {
  reportId: string;
  address: string;
  date: string;
  squares: number;
  facetCount: number;
  pitchBreakdown: { pitch: string; pct: number }[];
  predominantPitch: string;
};

export const EAGLEVIEW_SAMPLES: EagleViewSample[] = [
  {
    reportId: "47615518",
    address: "31 Plains Gap Rd, New Brunswick, NJ 08902-2667",
    date: "2022-08-14",
    squares: 25.9,
    facetCount: 14,
    pitchBreakdown: [
      { pitch: "7/12", pct: 83 },
      { pitch: "12/12", pct: 9 },
      { pitch: "8/12", pct: 6 },
      { pitch: "4/12", pct: 2 },
    ],
    predominantPitch: "7/12",
  },
  {
    reportId: "49582965",
    address: "14 Essex St, South River, NJ 08882-2323",
    date: "2022-11-05",
    squares: 19.5,
    facetCount: 7,
    pitchBreakdown: [
      { pitch: "5/12", pct: 79 },
      { pitch: "2/12", pct: 21 },
    ],
    predominantPitch: "5/12",
  },
  {
    reportId: "50061064",
    address: "18 Marie St, South River, NJ 08882-1725",
    date: "2022-12-21",
    squares: 20.1,
    facetCount: 9,
    pitchBreakdown: [
      { pitch: "5/12", pct: 78 },
      { pitch: "6/12", pct: 18 },
      { pitch: "2/12", pct: 5 },
    ],
    predominantPitch: "5/12",
  },
];
