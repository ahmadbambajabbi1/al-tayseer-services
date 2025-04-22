"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SubscriptionDetailProps {
  subscription: {
    _id: string;
    service: {
      _id: string;
      servicesCategory?: {
        name: string;
      };
      maximumKg?: number;
      total?: number;
      washFrequency?: number;
    };
    user?: {
      fullName: string;
      email: string;
      phoneNumber: string;
    };
    startDate?: string;
    endDate?: string;
    amount: number;
    washFrequencyTotal?: number;
    washFrequencyUsed?: number;
    washFrequencyLeft?: number;
    paymentStatus: string;
    paymentDate?: string;
    notes?: string;
    adminProcessor?: {
      fullName: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [paymentStatus, setPaymentStatus] = useState<string>(
    subscription.paymentStatus
  );
  const [notes, setNotes] = useState<string>(subscription.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isAdmin = session?.user.role === "admin";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const handleUpdatePayment = async () => {
    if (!isAdmin) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subscriptions/${subscription._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.refresh();
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get service name from category
  const serviceName = subscription.service?.servicesCategory?.name || "Service";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Details</h1>
        <Badge className={getStatusColor(subscription.paymentStatus)}>
          {subscription.paymentStatus.charAt(0).toUpperCase() +
            subscription.paymentStatus.slice(1)}
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Service Name</p>
              <p className="font-medium">{serviceName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maximum Capacity</p>
              <p className="font-medium">
                {subscription.service?.maximumKg || 0} kg
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="font-medium">${subscription.amount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
                {formatDate(subscription.createdAt)}
              </p>
            </div>
            {subscription.startDate && (
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
            )}
            {subscription.endDate && (
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {formatDate(subscription.endDate)}
                </p>
              </div>
            )}
          </div>

          {subscription.washFrequencyTotal !== undefined &&
            subscription.washFrequencyTotal > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Wash Frequency</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">
                      {subscription.washFrequencyTotal}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Used</p>
                    <p className="font-medium">
                      {subscription.washFrequencyUsed || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="font-medium">
                      {subscription.washFrequencyLeft ||
                        subscription.washFrequencyTotal}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {isAdmin && subscription.user && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{subscription.user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">
                  {subscription.user.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">
                  {subscription.user.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="font-medium">
                <Badge className={getStatusColor(subscription.paymentStatus)}>
                  {subscription.paymentStatus.charAt(0).toUpperCase() +
                    subscription.paymentStatus.slice(1)}
                </Badge>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Date</p>
              <p className="font-medium">
                {formatDate(subscription.paymentDate)}
              </p>
            </div>
            {subscription.adminProcessor && (
              <div>
                <p className="text-sm text-muted-foreground">Processed By</p>
                <p className="font-medium">
                  {subscription.adminProcessor.fullName}
                </p>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="space-y-4 pt-4 border-t mt-4">
              <div className="space-y-2">
                <p className="font-medium">Update Payment Status</p>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Notes</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this payment"
                />
              </div>

              <Button
                onClick={handleUpdatePayment}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Updating..." : "Update Payment"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
