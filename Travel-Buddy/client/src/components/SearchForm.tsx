import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Search, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TravelStyleSelector from './TravelStyleSelector';

// Define the form schema
const searchFormSchema = z.object({
  destination: z.string().min(2, { message: 'Please enter a destination' }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.string().optional(),
  travelStyles: z.array(z.string()).optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const budgetRanges = [
  { value: 'budget', label: 'Budget Friendly' },
  { value: 'mid-range', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'ultra-luxury', label: 'Ultra Luxury' },
];

const SearchForm = () => {
  const [, setLocation] = useLocation();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      destination: '',
      startDate: undefined,
      endDate: undefined,
      budget: '',
      travelStyles: [],
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    console.log('Search form data:', data);
    // Include selected travel styles
    data.travelStyles = selectedStyles;

    // Convert to query params and navigate to agents page
    const params = new URLSearchParams();
    if (data.destination) params.append('destination', data.destination);
    if (data.budget) params.append('budget', data.budget);
    if (data.startDate) params.append('startDate', data.startDate.toISOString());
    if (data.endDate) params.append('endDate', data.endDate.toISOString());
    if (data.travelStyles && data.travelStyles.length > 0) {
      params.append('styles', data.travelStyles.join(','));
    }

    setLocation(`/agents?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination Field */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where to?</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="City, country, or region"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Date Range Fields */}
          <div className="flex flex-col space-y-2">
            <FormLabel>When?</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'MMM d')
                            ) : (
                              <span>From</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'MMM d')
                            ) : (
                              <span>To</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => {
                            const start = form.getValues('startDate');
                            return start ? date < start : false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Budget Field */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {budgetRanges.map((budget) => (
                      <SelectItem key={budget.value} value={budget.value}>
                        {budget.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Travel Styles Field */}
          <div className="flex flex-col space-y-2">
            <FormLabel>Travel Style</FormLabel>
            <TravelStyleSelector
              selectedStyles={selectedStyles}
              onStylesChange={setSelectedStyles}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit" size="lg" className="px-8">
            <Search className="mr-2 h-4 w-4" />
            Find Travel Agents
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchForm;