import { ServicePage, serviceMetadata } from "@/components/site/service-page";

export const metadata = serviceMetadata("desarrollo-web");

export default function Page() {
  return <ServicePage slug="desarrollo-web" />;
}
