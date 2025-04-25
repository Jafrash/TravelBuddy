import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { destinations, budgetRanges } from "@/assets/destinations";
import TravelStyleSelector from "./TravelStyleSelector";

const searchFormSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  dates: z.string().min(1, "Travel dates are required"),
  budget: z.string().min(1, "Budget range is required"),
  travelStyles: z.array(z.string()).min(1, "Select at least one travel style"),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const SearchForm = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      destination: "",
      dates: "",
      budget: "",
      travelStyles: [],
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    toast({
      title: "Search initiated",
      description: `Looking for agents specializing in ${data.destination}`,
    });
    
    // Navigate to agents page with query parameters
    setLocation(`/agents?destination=${encodeURIComponent(data.destination)}&budget=${data.budget}`);
  };

  // Update the travelStyles field when selected styles change
  form.watch(() => {
    form.setValue("travelStyles", selectedStyles);
  });

  return (
    <Card className="bg-white text-left">
      <CardContent className="p-6">
        <h2 className="text-primary font-heading font-semibold text-xl mb-4">Where would you like to go?</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-neutral-dark mb-1 text-sm font-medium">
                      Destination
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((destination) => (
                            <SelectItem key={destination} value={destination}>
                              {destination}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-neutral-dark mb-1 text-sm font-medium">
                      Travel Dates
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Jun 15 - Jun 30, 2023" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="travelStyles"
              render={() => (
                <FormItem>
                  <FormLabel className="block text-neutral-dark mb-1 text-sm font-medium">
                    Travel Style
                  </FormLabel>
                  <FormControl>
                    <TravelStyleSelector 
                      selectedStyles={selectedStyles} 
                      onStylesChange={setSelectedStyles} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-neutral-dark mb-1 text-sm font-medium">
                    Budget Range
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-md font-medium text-lg"
            >
              Find My Travel Agent
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
