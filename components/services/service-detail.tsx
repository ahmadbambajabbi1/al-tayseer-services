"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface ServiceDetailProps {
  service: {
    _id: string
    servicesPeriod: {
      servicesPeriodByNumber: number
      servicesPeriodByWord: string
    }
    servicesCategory: {
      name: string
    }
    washFrequency: number
    washingFolding: number
    ironing: string
    maximumKg: number
    total: number
    description?: string
  }
}

export function ServiceDetail({ service }: ServiceDetailProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const formatPeriod = () => {
    if (!service.servicesPeriod) return "N/A"

    try {
      const { servicesPeriodByNumber, servicesPeriodByWord } = service.servicesPeriod
      return `${servicesPeriodByNumber} ${servicesPeriodByWord}${servicesPeriodByNumber > 1 && !servicesPeriodByWord.endsWith("s") ? "s" : ""}`
    } catch (error) {
      console.error("Error formatting period:", error)
      return "N/A"
    }
  }

  const handleSubscribe = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service._id,
          quantity: service.maximumKg,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      router.push("/dashboard/subscriptions")
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <div className="relative h-64 w-full">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt={service.servicesCategory?.name || "Laundry Service"}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{service.servicesCategory?.name || "Laundry Service"}</CardTitle>
            <Badge className="bg-sky-100 text-sky-700">${service.total.toFixed(2)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Service Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Period:</span>
                <span>{formatPeriod()}</span>

                <span className="text-muted-foreground">Wash Frequency:</span>
                <span>{service.washFrequency} times</span>

                <span className="text-muted-foreground">Maximum Weight:</span>
                <span>{service.maximumKg} kg</span>

                <span className="text-muted-foreground">Ironing:</span>
                <span>{service.ironing}</span>

                <span className="text-muted-foreground">Price per kg:</span>
                <span>${service.washingFolding.toFixed(2)}</span>

                <span className="text-muted-foreground">Total Price:</span>
                <span className="font-bold">${service.total.toFixed(2)}</span>
              </div>
            </div>

            {service.description && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Description</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400"
          >
            {isLoading ? "Processing..." : "Subscribe to this Service"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
