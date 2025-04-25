import { Button } from "@/components/ui/button";

const AppTest = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">App Test Page</h1>
      <p className="text-lg mb-8">If you can see this, the application is working correctly!</p>
      <Button>Test Button</Button>
    </div>
  );
};

export default AppTest;