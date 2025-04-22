"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { servicesPeriodSchema } from "@/lib/validations/service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PeriodFormValues = z.infer<typeof servicesPeriodSchema>;

interface PeriodFormProps {
  period?: {
    _id: string;
    servicesPeriodByNumber: number;
    servicesPeriodByWord: string;
  };
}

export function PeriodForm({ period }: PeriodFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<PeriodFormValues>({
    resolver: zodResolver(servicesPeriodSchema),
    defaultValues: {
      servicesPeriodByNumber: period?.servicesPeriodByNumber || 1,
      servicesPeriodByWord: (period?.servicesPeriodByWord as any) || "week",
    },
  });

  async function onSubmit(values: PeriodFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const url = period?._id
        ? `/api/services-periods/${period._id}`
        : "/api/services-periods";
      const method = period?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push("/admin/services/periods");
      router.refresh();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="servicesPeriodByNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter period number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="servicesPeriodByWord"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a period unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="minute">Minute</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : period
              ? "Update Period"
              : "Create Period"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
