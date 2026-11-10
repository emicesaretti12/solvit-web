import { ServicePage, serviceMetadata } from "@/components/site/service-page";

export const metadata = serviceMetadata("marketing-digital");

export default function Page() {
  return <ServicePage slug="marketing-digital" />;
}
