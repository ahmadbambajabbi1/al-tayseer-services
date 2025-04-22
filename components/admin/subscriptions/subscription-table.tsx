"use client";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";

interface SubscriptionTableProps {
  subscriptions: Array<{
    _id: string;
    user: {
      fullName: string;
    };
    service: {
      name: string;
    };
    quantity: number;
    totalPrice: number;
    paymentStatus: string;
    createdAt: string;
  }>;
}

export function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "refunded":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No subscriptions found.
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((subscription) => (
              <TableRow key={subscription._id}>
                <TableCell className="font-medium">
                  {subscription.user.fullName}
                </TableCell>
                <TableCell>{subscription.service.name}</TableCell>
                <TableCell>{subscription.quantity} kg</TableCell>
                <TableCell>D{subscription.totalPrice}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(subscription.paymentStatus)}
                  >
                    {subscription.paymentStatus.charAt(0).toUpperCase() +
                      subscription.paymentStatus.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(subscription.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/subscriptions/${subscription._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
