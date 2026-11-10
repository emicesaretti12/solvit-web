import { ServicePage, serviceMetadata } from "@/components/site/service-page";

export const metadata = serviceMetadata("hardware-iot");

export default function Page() {
  return <ServicePage slug="hardware-iot" />;
}
