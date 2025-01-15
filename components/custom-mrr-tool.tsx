"use client";

import React, { useState, useMemo, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  /*   ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon, */
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProps } from "recharts";
import domtoimage from "dom-to-image";

interface Payment {
  date: string;
  amount: number;
}

const sampleData: Payment[] = [
  { date: "2024-01-01", amount: 3000 },
  { date: "2024-01-08", amount: 3050 },
  { date: "2024-01-15", amount: 3100 },
  { date: "2024-01-22", amount: 3150 },
  { date: "2024-01-29", amount: 3200 },
  { date: "2024-02-05", amount: 3250 },
  { date: "2024-02-12", amount: 3300 },
  { date: "2024-02-19", amount: 3350 },
  { date: "2024-02-26", amount: 3400 },
  { date: "2024-03-05", amount: 3500 },
  { date: "2024-03-12", amount: 3600 },
  { date: "2024-03-19", amount: 3700 },
  { date: "2024-03-26", amount: 3800 },
  { date: "2024-04-02", amount: 3900 },
  { date: "2024-04-09", amount: 4000 },
  { date: "2024-04-16", amount: 4100 },
  { date: "2024-04-23", amount: 4200 },
  { date: "2024-04-30", amount: 4300 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string, timePeriod: string) => {
  const date = new Date(dateString);
  switch (timePeriod) {
    case "daily":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "monthly":
      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    default:
      return dateString;
  }
};

const PercentageChange = ({ value }: { value: number }) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      value >= 0
        ? "bg-green-100 text-green-800 border border-green-400"
        : "bg-red-100 text-red-800 border border-red-400"
    }`}
  >
    {value >= 0 ? "+" : ""}
    {value.toFixed(1)}%
  </span>
);

const CustomTooltip = ({
  active,
  payload,
  label,
  timePeriod,
}: TooltipProps<number, string> & { timePeriod: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">
          {formatDate(label, timePeriod)}
        </p>
        <p className="text-indigo-600 font-bold">
          {formatCurrency(payload[0].value ?? 0)}
        </p>
      </div>
    );
  }
  return null;
};

const gradients = {
  blue: "bg-gradient-to-r from-blue-500 to-teal-400",
  purple: "bg-gradient-to-r from-purple-500 to-pink-500",
  orange: "bg-gradient-to-r from-orange-400 to-rose-400",
  green: "bg-gradient-to-r from-green-400 to-cyan-500",
  red: "bg-gradient-to-r from-red-500 to-yellow-500",
  indigo: "bg-gradient-to-r from-indigo-500 to-purple-500",
  sunset: "bg-gradient-to-r from-orange-300 via-red-400 to-pink-500",
  ocean: "bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500",
  forest: "bg-gradient-to-r from-green-600 via-lime-500 to-emerald-600",
  aurora: "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600",
  fire: "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600",
  cosmic: "bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400",
};

interface DetailedChartProps {
  data: { date: string; amount: number }[];
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: string[];
}

const DetailedChart = ({
  data,
  timePeriod,
  selectedMonth,
  availableMonths,
}: DetailedChartProps) => {
  // Calculate the total MRR for the selected month
  const mrr = useMemo(() => {
    const monthData = data.filter((item) =>
      item.date.startsWith(selectedMonth.slice(0, 7))
    );
    return monthData.reduce((sum, item) => sum + item.amount, 0);
  }, [data, selectedMonth]);

  // Calculate the previous month's MRR
  const previousMonthIndex =
    availableMonths.indexOf(selectedMonth.slice(0, 7)) - 1;
  const previousMonth =
    previousMonthIndex >= 0 ? availableMonths[previousMonthIndex] : null;
  const previousMRR = useMemo(() => {
    if (!previousMonth) return 0;
    const prevMonthData = data.filter((item) =>
      item.date.startsWith(previousMonth)
    );
    return prevMonthData.reduce((sum, item) => sum + item.amount, 0);
  }, [data, previousMonth]);

  const percentageChange = previousMRR
    ? ((mrr - previousMRR) / previousMRR) * 100
    : 0;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              MRR Overview
            </h2>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900">
              {formatCurrency(mrr)}
            </div>
            <div className="flex items-center mt-2">
              <PercentageChange value={percentageChange} />
              <span className="text-sm text-gray-500 ml-2">
                vs previous month
              </span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={
                timePeriod === "daily"
                  ? data.filter((item) =>
                      item.date.startsWith(selectedMonth.slice(0, 7))
                    )
                  : data
              }
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => formatDate(value, timePeriod)}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip timePeriod={timePeriod} />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Updated today</span>
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View more
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CustomMrrTool() {
  const [payments, setPayments] = useState<Payment[]>(sampleData);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState("stats");
  const [gradient, setGradient] = useState("blue");
  const exportRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const availableMonths = useMemo(() => {
    const months = payments.map((payment) => payment.date.slice(0, 7));
    return Array.from(new Set(months)).sort();
  }, [payments]);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const lastMonth = availableMonths[availableMonths.length - 1];
    return lastMonth ? new Date(`${lastMonth}-01`) : new Date();
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return availableMonths[availableMonths.length - 1] + "-01" || "";
  });

  const addPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && amount) {
      setPayments([...payments, { date, amount: parseFloat(amount) }]);
      setDate("");
      setAmount("");
    }
  };

  const deletePayment = (dateToDelete: string) => {
    setPayments(payments.filter((payment) => payment.date !== dateToDelete));
  };

  const getAggregatedData = useMemo(() => {
    const sortedPayments = [...payments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const aggregateData = (period: "daily" | "monthly") => {
      const aggregated: { [key: string]: number } = {};
      sortedPayments.forEach((payment) => {
        const date = new Date(payment.date);
        let key: string;
        switch (period) {
          case "daily":
            key = payment.date;
            break;
          case "monthly":
            key = date.toISOString().slice(0, 7);
            break;
        }
        aggregated[key] = (aggregated[key] || 0) + payment.amount;
      });
      return Object.entries(aggregated).map(([date, amount]) => ({
        date,
        amount,
      }));
    };

    return {
      daily: aggregateData("daily"),
      monthly: aggregateData("monthly"),
    };
  }, [payments]);

  const currentData =
    getAggregatedData[timePeriod as keyof typeof getAggregatedData];

  const exportAsImage = async () => {
    if (exportRef.current) {
      try {
        await document.fonts.ready;
        const node = exportRef.current;
        const scale = 2;
        const style = {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
        };
        const params = {
          height: node.offsetHeight * scale,
          width: node.offsetWidth * scale,
          quality: 1,
          style,
        };
        const blob = await domtoimage.toBlob(node, params);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `mrr-overview-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating screenshot:", error);
        alert(
          "There was an error generating the screenshot. Please try again."
        );
      }
    } else {
      console.error("Export reference is not available");
      alert("Unable to generate screenshot. Please try again later.");
    }
  };

  const monthlyPayments = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const selectedMonth = `${year}-${month.toString().padStart(2, "0")}`;
    return payments.filter((payment) => payment.date.startsWith(selectedMonth));
  }, [payments, selectedDate]);

  const handlePreviousMonth = () => {
    startTransition(() => {
      const currentMonthString = selectedDate.toISOString().slice(0, 7);
      const currentIndex = availableMonths.indexOf(currentMonthString);
      if (currentIndex > 0) {
        const previousMonth = availableMonths[currentIndex - 1];
        setSelectedDate(new Date(previousMonth + "-01"));
        setSelectedMonth(previousMonth + "-01");
      }
    });
  };

  const handleNextMonth = () => {
    startTransition(() => {
      const currentMonthString = selectedDate.toISOString().slice(0, 7);
      const currentIndex = availableMonths.indexOf(currentMonthString);
      if (currentIndex < availableMonths.length - 1) {
        const nextMonth = availableMonths[currentIndex + 1];
        setSelectedDate(new Date(nextMonth + "-01"));
        setSelectedMonth(nextMonth + "-01");
      }
    });
  };

  const canGoToPreviousMonth =
    availableMonths.indexOf(selectedDate.toISOString().slice(0, 7)) > 0;
  const canGoToNextMonth =
    availableMonths.indexOf(selectedDate.toISOString().slice(0, 7)) <
    availableMonths.length - 1;

  const handleDialogOpenChange = (open: boolean) => {
    setIsExportDialogOpen(open);
    if (!open) {
      // Reset export type to "stats" when dialog is closed
      setExportType("stats");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-3xl mx-auto py-4">
        <div className="flex flex-col lg:flex-row gap-3 w-full max-w-3xl mx-auto py-4">
          <div className="flex items-center space-x-4 w-full lg:w-fit border border-neutral-200 rounded-md p-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              disabled={!canGoToPreviousMonth || isPending}
              className="w-12 h-10 lg:h-7 lg:w-7 lg:rounded"
            >
              <ChevronLeftIcon className="h-5 w-5 md:h-4 md:w-4" />
            </Button>
            <div className="text-sm font-medium w-full lg:w-fit flex justify-center">
              {selectedDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              disabled={!canGoToNextMonth || isPending}
              className="w-12 h-10 lg:h-7 lg:w-7 lg:rounded"
            >
              <ChevronRightIcon className="h-5 w-5 md:h-4 md:w-4" />
            </Button>
          </div>

          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-full lg:w-[140px] focus:outline-none focus:ring-transparent">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="font-sans">
              <SelectItem className="cursor-pointer" value="daily">
                Daily
              </SelectItem>
              <SelectItem className="cursor-pointer" value="monthly">
                Monthly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isExportDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="w-full lg:w-fit">
              <DownloadIcon className="mr-2 h-4 w-4" /> Export as Image
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`mx-auto font-sans transition-all max-h-[85vh] overflow-y-auto duration-300 p-0 gap-0 ease-in-out ${
              exportType === "stats"
                ? "max-w-[32rem]"
                : "max-w-[60rem] origin-top-left"
            }`}
          >
            <div className="p-4 lg:p-10 pb-0 lg:pb-0">
              <DialogHeader>
                <DialogTitle
                  className={`text-lg font-bold ${
                    exportType === "stats" ? "pl-1" : "pl-10"
                  }`}
                >
                  Export MRR Data
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 items-center justify-center">
                <Tabs
                  defaultValue="stats"
                  onValueChange={(value) =>
                    setExportType(value as "stats" | "graph")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stats">Export Stats</TabsTrigger>
                    <TabsTrigger value="graph">Export Graph</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div
                  ref={exportRef}
                  className={`${
                    gradients[gradient as keyof typeof gradients]
                  } p-8 rounded-lg ${
                    exportType === "stats"
                      ? "w-full"
                      : "lg:min-w-[50rem] w-full lg:w-max "
                  }`}
                >
                  {exportType === "stats" ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold mb-4">MRR Stats</h2>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-3xl font-bold">
                          {formatCurrency(
                            currentData[currentData.length - 1]?.amount || 0
                          )}
                        </span>
                        <PercentageChange
                          value={
                            (((currentData[currentData.length - 1]?.amount ||
                              0) -
                              (currentData[currentData.length - 2]?.amount ||
                                0)) /
                              (currentData[currentData.length - 2]?.amount ||
                                1)) *
                            100
                          }
                        />
                      </div>
                      <p className="text-neutral-600">
                        Previous period:{" "}
                        {formatCurrency(
                          currentData[currentData.length - 2]?.amount || 0
                        )}
                      </p>
                      <p className="text-sm text-neutral-500 mt-4">
                        Generated on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4">
                      <DetailedChart
                        data={currentData}
                        timePeriod={timePeriod}
                        setTimePeriod={setTimePeriod}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        availableMonths={availableMonths}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                  {Object.entries(gradients).map(([key, value]) => (
                    <button
                      key={key}
                      className={`w-12 h-12 rounded-md ${value} ${
                        gradient === key
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => setGradient(key)}
                      aria-label={`Select ${key} gradient`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white/20 backdrop-blur-md h-20 w-[calc(100%-2rem)] mx-auto flex justify-center items-center">
              <Button onClick={exportAsImage} className="w-full">
                Download Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="w-full max-w-3xl mx-auto mb-8">
        <CardContent id="export-container" className="p-2">
          <DetailedChart
            data={currentData}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            availableMonths={availableMonths}
          />
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPayment} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full lg:w-fit" type="submit">
              Add Payment
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 justify-between items-center">
            <CardTitle className="w-full">Monthly Payment History</CardTitle>
            <div className="flex items-center space-x-4 w-full justify-start lg:justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
                disabled={!canGoToPreviousMonth || isPending}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                {selectedDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                disabled={!canGoToNextMonth || isPending}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <div
              className={`transition-opacity duration-300 ${
                isPending ? "opacity-50" : "opacity-100"
              }`}
            >
              {monthlyPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      {/*  <TableHead>Change</TableHead> */}
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyPayments.map((payment, index /* arr */) => {
                      /*  const prevPayment = arr[index + 1];
                      const change = prevPayment
                        ? payment.amount - prevPayment.amount
                        : 0;
                      const changePercentage = prevPayment
                        ? (change / prevPayment.amount) * 100
                        : 0; */
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {formatDate(payment.date, "daily")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          {/*    <TableCell>
                            <div className="flex items-center space-x-2">
                              {change !== 0 ? (
                                change > 0 ? (
                                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                                ) : (
                                  <ArrowDownIcon className="w-4 h-4 text-red-500" />
                                )
                              ) : (
                                <MinusIcon className="w-4 h-4 text-gray-500" />
                              )}
                              <span
                                className={
                                  change > 0
                                    ? "text-green-600"
                                    : change < 0
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }
                              >
                                {change !== 0
                                  ? `${changePercentage.toFixed(2)}%`
                                  : "-"}
                              </span>
                            </div>
                          </TableCell> */}
                          <TableCell>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => deletePayment(payment.date)}
                              className="group"
                            >
                              <Trash2Icon className="h-4 w-4 group-hover:text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-5 border-t border-dashed border-gray-200/60 text-gray-500">
                  No data available for this month.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
