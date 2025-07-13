import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DataField {
  field: string;
  description: string;
  source: 'database' | 'calculated' | 'derived';
}

interface DataSourceIndicatorProps {
  title: string;
  fields: DataField[];
  className?: string;
}

export const DataSourceIndicator = ({ title, fields, className = "" }: DataSourceIndicatorProps) => {
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'database': return 'bg-green-100 text-green-800 border-green-200';
      case 'calculated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'derived': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-1 text-xs text-muted-foreground cursor-help ${className}`}>
            <Info className="h-3 w-3" />
            <span>Data Source</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3" side="bottom">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{title} - Data Sources</h4>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-0 ${getSourceColor(field.source)}`}
                  >
                    {field.source}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium text-xs">{field.field}</div>
                    <div className="text-xs text-muted-foreground">{field.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Database: Direct from invoice_data table</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Calculated: Computed from database fields</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Derived: Inferred or estimated values</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};