import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, DollarSign, Activity, Bot } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Senior Management Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive invoice analytics and financial insights dashboard for executive decision making
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground">Financial Overview</h3>
            </div>
            <p className="text-sm text-muted-foreground">Track total fees, charges, and financial performance</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-accent rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground">Trend Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">Historical patterns and growth predictions</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-success rounded-lg">
                <BarChart3 className="h-6 w-6 text-success-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground">Service Analytics</h3>
            </div>
            <p className="text-sm text-muted-foreground">Service code performance and optimization</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground">Live Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground">Real-time KPIs and performance metrics</p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/ml-analytics')}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
          >
            View Analytics Dashboard
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/agent-management')}
            className="text-lg px-8 py-6 border-primary/20 hover:bg-primary/5"
          >
            <Bot className="mr-2 h-5 w-5" />
            Manage AI Agents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
