import Homepage from "@/components/homepage";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function page() {
  return (
    <div className="max-w-7xl mx-auto h-screen py-10">
      <BackgroundBeams />
      <Homepage />
    </div>
  );
}
