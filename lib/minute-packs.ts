export interface MinutePack {
  id: string;
  name: string;
  minutes: number;
  price: number;
  savingsPercent?: number;
}

export const availableMinutePacks: MinutePack[] = [
  {
    id: "pack-50",
    name: "50 Bonus Minutes",
    minutes: 50,
    price: 10,
  },
  {
    id: "pack-100",
    name: "100 Bonus Minutes",
    minutes: 100,
    price: 18,
    savingsPercent: 10,
  },
  {
    id: "pack-500",
    name: "500 Bonus Minutes",
    minutes: 500,
    price: 80,
    savingsPercent: 20,
  },
  {
    id: "pack-1000",
    name: "1000 Bonus Minutes",
    minutes: 1000,
    price: 150,
    savingsPercent: 25,
  },
];

