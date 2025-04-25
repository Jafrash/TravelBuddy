import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";

export default function NotFound() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4 gap-3">
              <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </div>

            <p className="mt-4 mb-6 text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Button 
              onClick={() => navigate("/")} 
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <SimpleFooter />
    </div>
  );
}
