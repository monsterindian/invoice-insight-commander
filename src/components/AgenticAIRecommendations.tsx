import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertCircle, TrendingUp, Target, Zap, CheckCircle } from 'lucide-react';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'optimization' | 'investigation' | 'action' | 'monitoring';
  potentialImpact?: string;
}

interface AgenticAIRecommendationsProps {
  title: string;
  recommendations: AIRecommendation[];
}

export const AgenticAIRecommendations = ({ title, recommendations }: AgenticAIRecommendationsProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'optimization': return <Target className="h-4 w-4" />;
      case 'investigation': return <AlertCircle className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'monitoring': return <TrendingUp className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'optimization': return 'text-success';
      case 'investigation': return 'text-warning';
      case 'action': return 'text-primary';
      case 'monitoring': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Brain className="h-5 w-5" />
          🤖 Agentic AI Recommendations - {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-card border rounded-lg hover:shadow-card transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={getCategoryColor(rec.category)}>
                    {getCategoryIcon(rec.category)}
                  </span>
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(rec.priority) as any} className="text-xs">
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {rec.category.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
              {rec.potentialImpact && (
                <p className="text-xs text-success font-medium">💰 {rec.potentialImpact}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};