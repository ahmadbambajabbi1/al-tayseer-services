"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionCard } from "@/components/subscriptions/subscription-card"

interface UserDetailProps {
  user: {
    _id: string
    fullName: string
    email?: string
    phoneNumber?: string
    deliveryAddress?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
    additionalInfo?: string
    onboardingCompleted: boolean
    createdAt: string
  }
  subscriptions: Array<{
    _id: string
    service: {
      name: string
    }
    quantity: number
    totalPrice: number
    paymentStatus: string
    createdAt: string
  }>
}

export function UserDetail({ user, subscriptions }: UserDetailProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">User Details</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{user.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Onboarding Status</p>
                  <p className="font-medium">
                    <Badge
                      variant={user.onboardingCompleted ? "default" : "outline"}
                      className={user.onboardingCompleted ? "bg-green-100 text-green-800" : ""}
                    >
                      {user.onboardingCompleted ? "Completed" : "Incomplete"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.onboardingCompleted && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Street</p>
                    <p className="font-medium">{user.deliveryAddress?.street || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{user.deliveryAddress?.city || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State/Province</p>
                    <p className="font-medium">{user.deliveryAddress?.state || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zip/Postal Code</p>
                    <p className="font-medium">{user.deliveryAddress?.zipCode || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{user.deliveryAddress?.country || "N/A"}</p>
                  </div>
                </div>

                {user.additionalInfo && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Additional Information</p>
                    <p className="font-medium">{user.additionalInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="subscriptions" className="pt-4">
          {subscriptions.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard key={subscription._id} subscription={subscription} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No subscriptions found</h2>
              <p className="text-muted-foreground mt-2">This user hasn't subscribed to any services yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
