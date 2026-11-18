import { ServicePage, serviceMetadata } from "@/components/site/service-page";

export const metadata = serviceMetadata("software-a-medida");

export default function Page() {
  return <ServicePage slug="software-a-medida" />;
}
