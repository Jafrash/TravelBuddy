import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";

export default function FullLayoutTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="p-8 flex-grow">
        <h1 className="text-2xl font-bold">Test Page with Header and Footer</h1>
        <p className="mt-4">This is a test page with the full layout (Header and SimpleFooter) to verify there are no recursion issues.</p>
      </div>
      <SimpleFooter />
    </div>
  );
}