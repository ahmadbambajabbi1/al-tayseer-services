"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface Service {
  _id: string;
  servicesPeriod?: {
    _id?: string;
    servicesPeriodByNumber?: number;
    servicesPeriodByWord?: string;
  };
  servicesCategory?: {
    _id?: string;
    name?: string;
  };
  washFrequency: number;
  washingFolding: number;
  ironing: string;
  maximumKg: number;
  total: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceTableProps {
  services: Service[];
}

export function ServiceTable({ services }: ServiceTableProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`/api/services/${serviceToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setServiceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const formatPeriod = (service: Service) => {
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Wash Frequency</TableHead>
              <TableHead>Max Kg</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No services found
                </TableCell>
              </TableRow>
            )}
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <Badge variant="outline">
                    {service.servicesCategory && service.servicesCategory.name
                      ? service.servicesCategory.name
                      : "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>{formatPeriod(service)}</TableCell>
                <TableCell>{service.washFrequency} times</TableCell>
                <TableCell>{service.maximumKg} kg</TableCell>
                <TableCell>${service.total.toFixed(2)}</TableCell>
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
                        <Link href={`/admin/services/${service._id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(service._id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
