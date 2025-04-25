export default function SimpleFooter() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Wanderwise. All rights reserved.
        </p>
      </div>
    </footer>
  );
}