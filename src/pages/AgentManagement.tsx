import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Bot, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Eye, 
  Pause, 
  Play, 
  Settings, 
  Shield, 
  TrendingUp,
  Zap,
  Home,
  BarChart
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  accuracy: number;
  tasksCompleted: number;
  costSavings: number;
  lastActivity: string;
  description: string;
  isEnabled: boolean;
}

interface ActivityLog {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  timestamp: string;
  impact: string;
  severity: 'info' | 'warning' | 'success' | 'error';
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Anomaly Detection Agent',
    type: 'Anomaly Detection',
    status: 'active',
    accuracy: 94.2,
    tasksCompleted: 1247,
    costSavings: 45678,
    lastActivity: '2 minutes ago',
    description: 'Identifies unusual invoice patterns, duplicate charges, and pricing discrepancies',
    isEnabled: true
  },
  {
    id: '2',
    name: 'Compliance Monitor',
    type: 'Compliance Monitoring',
    status: 'active',
    accuracy: 98.7,
    tasksCompleted: 892,
    costSavings: 23456,
    lastActivity: '5 minutes ago',
    description: 'Ensures invoices meet regulatory requirements and tax calculations',
    isEnabled: true
  },
  {
    id: '3',
    name: 'Predictive Analytics Agent',
    type: 'Predictive Analytics',
    status: 'active',
    accuracy: 91.5,
    tasksCompleted: 543,
    costSavings: 78901,
    lastActivity: '1 hour ago',
    description: 'Forecasts payment trends and cash flow predictions',
    isEnabled: true
  },
  {
    id: '4',
    name: 'Cost Optimization Agent',
    type: 'Cost Optimization',
    status: 'paused',
    accuracy: 87.3,
    tasksCompleted: 234,
    costSavings: 34567,
    lastActivity: '3 hours ago',
    description: 'Identifies opportunities for cost savings and contract renegotiation',
    isEnabled: false
  },
  {
    id: '5',
    name: 'Risk Assessment Agent',
    type: 'Risk Assessment',
    status: 'active',
    accuracy: 95.8,
    tasksCompleted: 678,
    costSavings: 12345,
    lastActivity: '30 minutes ago',
    description: 'Evaluates vendor risk and payment default probability',
    isEnabled: true
  },
  {
    id: '6',
    name: 'Data Quality Agent',
    type: 'Data Quality',
    status: 'error',
    accuracy: 89.1,
    tasksCompleted: 456,
    costSavings: 9876,
    lastActivity: '2 hours ago',
    description: 'Monitors data integrity and identifies missing/incorrect information',
    isEnabled: true
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    agentId: '1',
    agentName: 'Anomaly Detection Agent',
    action: 'Detected duplicate invoice charges totaling $4,567 from Vendor XYZ',
    timestamp: '2 minutes ago',
    impact: '$4,567 potential savings',
    severity: 'warning'
  },
  {
    id: '2',
    agentId: '2',
    agentName: 'Compliance Monitor',
    action: 'Validated 23 invoices for tax compliance - all passed',
    timestamp: '5 minutes ago',
    impact: '100% compliance rate',
    severity: 'success'
  },
  {
    id: '3',
    agentId: '3',
    agentName: 'Predictive Analytics Agent',
    action: 'Updated cash flow forecast - predicted 15% increase in Q4',
    timestamp: '1 hour ago',
    impact: 'Improved planning accuracy',
    severity: 'info'
  },
  {
    id: '4',
    agentId: '5',
    agentName: 'Risk Assessment Agent',
    action: 'High-risk vendor detected - payment delay probability 78%',
    timestamp: '30 minutes ago',
    impact: 'Risk mitigation required',
    severity: 'error'
  }
];

export function AgentManagement() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>(mockAgents);

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getSeverityIcon = (severity: ActivityLog['severity']) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, isEnabled: !agent.isEnabled, status: !agent.isEnabled ? 'active' : 'paused' }
        : agent
    ));
  };

  const totalCostSavings = agents.reduce((sum, agent) => sum + agent.costSavings, 0);
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const averageAccuracy = agents.reduce((sum, agent) => sum + agent.accuracy, 0) / agents.length;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Agent Management</h1>
            <p className="text-muted-foreground">Monitor and manage your AI agents for maximum efficiency and ROI</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/ml-analytics')}
              className="flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              Analytics Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              of {agents.length} total agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCostSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(agent.status)}
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={agent.isEnabled}
                        onCheckedChange={() => toggleAgent(agent.id)}
                      />
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Accuracy</span>
                    <span className="text-sm">{agent.accuracy}%</span>
                  </div>
                  <Progress value={agent.accuracy} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tasks Completed</span>
                      <p className="font-medium">{agent.tasksCompleted.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost Savings</span>
                      <p className="font-medium">${agent.costSavings.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={agent.status === 'active' ? 'default' : agent.status === 'paused' ? 'secondary' : 'destructive'}>
                        {agent.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Activity</span>
                      <p className="font-medium">{agent.lastActivity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Activity Feed</CardTitle>
              <CardDescription>Live updates from all active agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(log.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">{log.agentName}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-sm mt-1">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-2">{log.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Impact Overview</CardTitle>
                <CardDescription>Key metrics showing agent value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Risk Mitigation</span>
                    <span className="text-sm font-bold">$234,567</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Efficiency Gains</span>
                    <span className="text-sm font-bold">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compliance Rate</span>
                    <span className="text-sm font-bold">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Return on AI investment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">457%</div>
                  <p className="text-sm text-muted-foreground">Total ROI</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Savings</span>
                    <span className="text-sm font-medium">$204,023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Operational Efficiency</span>
                    <span className="text-sm font-medium">$156,789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Risk Avoidance</span>
                    <span className="text-sm font-medium">$89,456</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-sm">Total Value</span>
                      <span className="text-sm">$450,268</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}