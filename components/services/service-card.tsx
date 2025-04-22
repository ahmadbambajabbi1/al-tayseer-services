"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeIn } from "@/lib/animations";

interface ServiceCardProps {
  service: {
    _id: string;
    servicesPeriod?: {
      servicesPeriodByNumber?: number;
      servicesPeriodByWord?: string;
    };
    servicesCategory?: {
      name?: string;
    };
    washFrequency: number;
    washingFolding: number;
    ironing: string;
    maximumKg: number;
    total: number;
    description?: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const formatPeriod = () => {
    if (!service.servicesPeriod) return "N/A";

    try {
      const { servicesPeriodByNumber, servicesPeriodByWord } =
        service.servicesPeriod;
      if (!servicesPeriodByNumber || !servicesPeriodByWord) return "N/A";

      return `${servicesPeriodByNumber} ${servicesPeriodByWord}${
        servicesPeriodByNumber > 1 && !servicesPeriodByWord.endsWith("s")
          ? "s"
          : ""
      }`;
    } catch (error) {
      console.error("Error formatting period:", error);
      return "N/A";
    }
  };

  const categoryName =
    service.servicesCategory && service.servicesCategory.name
      ? service.servicesCategory.name
      : "Laundry Service";

  return (
    <motion.div variants={fadeIn("up", 0.2)} className="overflow-hidden">
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt={categoryName}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{categoryName}</CardTitle>
            <Badge
              variant="outline"
              className="bg-sky-50 text-sky-700 border-sky-200"
            >
              D{service.total.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-medium">{formatPeriod()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wash Frequency:</span>
              <span className="font-medium">{service.washFrequency} times</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Maximum Weight:</span>
              <span className="font-medium">{service.maximumKg} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ironing:</span>
              <span className="font-medium">{service.ironing}</span>
            </div>
          </div>
          {service.description && (
            <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
              {service.description}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/services/${service._id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
