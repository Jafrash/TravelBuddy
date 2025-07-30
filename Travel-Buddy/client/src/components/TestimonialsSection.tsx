import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily Watson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    testimonial: "Our family trip to Italy was perfect thanks to Sarah. She created an itinerary that kept our kids engaged while still letting us enjoy the culture and food. The private tours she arranged were the highlight!",
    trip: "Italy Family Vacation, July 2023"
  },
  {
    name: "Michael Tan",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    testimonial: "As a solo traveler in Southeast Asia, I was concerned about safety and finding authentic experiences. David's local knowledge was invaluable, and the itinerary he created was perfect - adventurous yet practical.",
    trip: "Thailand & Vietnam Adventure, March 2023"
  },
  {
    name: "Jessica & Alex Porter",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    rating: 5,
    testimonial: "Maria created the honeymoon of our dreams in Mexico. Every detail was perfect - from the secluded beaches to the surprise sunset dinner she arranged. Having everything organized in one app made our trip stress-free.",
    trip: "Mexico Honeymoon, May 2023"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            What Travelers Are Saying
          </h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Real experiences from travelers who found their perfect trips through our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-neutral-light p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <div className="flex mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-neutral-dark mb-2">"{testimonial.testimonial}"</p>
              <p className="text-sm text-neutral-dark italic">{testimonial.trip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
