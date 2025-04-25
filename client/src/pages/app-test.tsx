import { Button } from "@/components/ui/button";
import { useState } from "react";

const AppTest = () => {
  const [clickCount, setClickCount] = useState(0);
  
  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">App Test Page</h1>
      <p className="text-lg mb-8">If you can see this, the application is working correctly!</p>
      
      <div className="mb-4">
        <Button 
          className="bg-primary hover:bg-primary/90 text-white" 
          onClick={handleClick}
        >
          Test Button (Clicked: {clickCount})
        </Button>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Available Routes:</h2>
        <ul className="list-disc pl-5">
          <li><a href="/home" className="text-blue-500 hover:underline">Home Page (/home)</a></li>
          <li><a href="/auth" className="text-blue-500 hover:underline">Auth Page (/auth)</a></li>
          <li><a href="/agents" className="text-blue-500 hover:underline">Agents Page (/agents)</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AppTest;