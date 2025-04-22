import connectDB from "@/lib/db";
import Services from "@/models/service";
import "@/models/services-period";
import "@/models/services-category";

export async function getServices() {
  await connectDB();
  try {
    // First check if the model exists
    if (!Services) {
      console.error("Services model is not defined");
      return [];
    }

    // Try to fetch services with error handling for populate
    let servicesQuery = Services.find();

    try {
      servicesQuery = servicesQuery.populate("servicesPeriod");
    } catch (error) {
      console.error("Error populating servicesPeriod:", error);
    }

    try {
      servicesQuery = servicesQuery.populate("servicesCategory");
    } catch (error) {
      console.error("Error populating servicesCategory:", error);
    }

    const services = await servicesQuery.sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}
export async function getService(id: string) {
  await connectDB();
  try {
    const service = await Services.findById(id)
      .populate("servicesPeriod")
      .populate("servicesCategory");

    if (!service) {
      return null;
    }

    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}
