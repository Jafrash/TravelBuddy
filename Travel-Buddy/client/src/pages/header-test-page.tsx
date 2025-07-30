import Header from "@/components/Header";

export default function HeaderTestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="p-8 flex-grow">
        <h1 className="text-2xl font-bold">Test Page with Header</h1>
        <p className="mt-4">This is a test page with just the Header component to isolate recursion issues.</p>
      </div>
    </div>
  );
}