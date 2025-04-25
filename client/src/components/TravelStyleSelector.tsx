import { Button } from "@/components/ui/button";
import { travelStyles } from "@/assets/travelStyles";

interface TravelStyleSelectorProps {
  selectedStyles: string[];
  onStylesChange: (styles: string[]) => void;
}

const TravelStyleSelector = ({ selectedStyles, onStylesChange }: TravelStyleSelectorProps) => {
  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      onStylesChange(selectedStyles.filter(id => id !== styleId));
    } else {
      onStylesChange([...selectedStyles, styleId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {travelStyles.map((style) => (
        <Button
          key={style.id}
          type="button"
          variant="outline"
          size="sm"
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedStyles.includes(style.id) 
              ? "bg-primary text-white border-primary" 
              : "border-neutral-medium hover:bg-primary hover:text-white hover:border-primary"
          }`}
          onClick={() => toggleStyle(style.id)}
        >
          {style.label}
        </Button>
      ))}
    </div>
  );
};

export default TravelStyleSelector;
