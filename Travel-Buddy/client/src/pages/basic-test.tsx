import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function BasicTest() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-4">TravelBuddy</h1>
        <p className="text-lg mb-8 text-center">Welcome to our travel planning application</p>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Pages:</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/app-test">
              <Button className="w-full">App Test</Button>
            </Link>
            <Link href="/home">
              <Button className="w-full">Home</Button>
            </Link>
            <Link href="/auth">
              <Button className="w-full">Auth</Button>
            </Link>
            <Link href="/agents">
              <Button className="w-full">Agents</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}