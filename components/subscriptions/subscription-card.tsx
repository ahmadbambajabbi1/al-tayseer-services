import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SubscriptionCardProps {
  subscription: {
    _id: string;
    service: {
      maximumKg?: number;
      total?: number;
      servicesCategory?: {
        name?: string;
      };
    };
    amount?: number;
    washFrequencyTotal?: number;
    washFrequencyUsed?: number;
    paymentStatus: string;
    createdAt: string;
  };
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get service name from category
  const serviceName = subscription.service.servicesCategory?.name || "Service";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{serviceName}</CardTitle>
          <Badge className={getStatusColor(subscription.paymentStatus)}>
            {subscription.paymentStatus.charAt(0).toUpperCase() +
              subscription.paymentStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Maximum Kg:</span>
            <span>{subscription.service.maximumKg || 0} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span>D{subscription.amount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{formatDate(subscription.createdAt)}</span>
          </div>
          {subscription.washFrequencyTotal &&
            subscription.washFrequencyTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Washes:</span>
                <span>
                  {subscription.washFrequencyUsed || 0}/
                  {subscription.washFrequencyTotal}
                </span>
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/dashboard/subscriptions/${subscription._id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
