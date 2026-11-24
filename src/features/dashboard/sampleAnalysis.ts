import type { DashboardAnalysis } from "./DashboardPage";

export const sampleAnalysis: DashboardAnalysis = {
  domains: [
    { name: "Security and Compliance", confused: 9, total: 20 },
    { name: "Cloud Technology and Services", confused: 6, total: 18 },
    { name: "Cloud Concepts", confused: 2, total: 12 },
    { name: "Billing, Pricing, and Support", confused: 1, total: 8 },
  ],
  repeatedQuestions: 5,
  analyzedAt: "2026-11-24T03:00:00+09:00",
};
