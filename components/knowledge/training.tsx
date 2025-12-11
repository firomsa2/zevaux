"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Bot, Search, MessageSquare, Zap, BarChart, Play, RefreshCw, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getKnowledgeStats } from "@/actions/knowledge";

interface TestResult {
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  responseTime: number;
}

export default function TrainingForm() {
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const [testQuestion, setTestQuestion] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalChunks: 0,
    lastTraining: null as string | null,
    avgResponseTime: 0,
    successRate: 0,
  });

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      
      const result = await getKnowledgeStats();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      const stats = result.data;
      
      setStats({
        totalDocuments: stats.total,
        totalChunks: stats.totalChunks,
        lastTraining: stats.lastUpdated,
        avgResponseTime: 0.8, // Mock data - would come from webhook
        successRate: 95, // Mock data - would come from webhook
      });

    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testQuestionAnswering = async () => {
    if (!testQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    try {
      const result = await testQuestion(testQuestion);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const newResult: TestResult = {
        question: testQuestion,
        answer: result.data.answer,
        confidence: result.data.confidence,
        sources: result.data.sources,
        responseTime: result.data.responseTime,
      };

      setTestResults(prev => [newResult, ...prev]);
      setTestQuestion("");

      toast({
        title: "Success",
        description: "Test completed successfully",
        variant: "default",
      });

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const retrainModel = async () => {
    setTesting(true);
    try {
      const result = await retrainModel();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "AI model is being retrained with your knowledge base",
        variant: "default",
      });

      // Refresh stats after retraining
      setTimeout(() => {
        fetchTrainingData();
      }, 3000);

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

//   const fetchTrainingData = async () => {
//     try {
//       setLoading(true);
      
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("No user found");

//       const { data: userData } = await supabase
//         .from("users")
//         .select("business_id")
//         .eq("id", user.id)
//         .single();

//       if (!userData?.business_id) throw new Error("No business found");
//       setBusinessId(userData.business_id);

//       // Fetch stats
//       const [docsRes, chunksRes] = await Promise.all([
//         supabase
//           .from("knowledge_base_documents")
//           .select("id, updated_at")
//           .eq("business_id", userData.business_id),
//         supabase
//           .from("knowledge_base_chunks")
//           .select("id")
//           .eq("business_id", userData.business_id),
//       ]);

//       if (docsRes.error) throw docsRes.error;
//       if (chunksRes.error) throw chunksRes.error;

//       // Calculate stats
//       const totalDocs = docsRes.data?.length || 0;
//       const totalChunks = chunksRes.data?.length || 0;
//       const lastUpdate = docsRes.data && docsRes.data.length > 0
//         ? docsRes.data.reduce((latest, doc) => 
//             new Date(doc.updated_at) > new Date(latest) ? doc.updated_at : latest
//           , docsRes.data[0].updated_at)
//         : null;

//       setStats({
//         totalDocuments: totalDocs,
//         totalChunks: totalChunks,
//         lastTraining: lastUpdate,
//         avgResponseTime: 0.8, // Mock data
//         successRate: 95, // Mock data
//       });

//     } catch (err: any) {
//       setError(err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testQuestionAnswering = async () => {
//     if (!testQuestion.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a question",
//         variant: "destructive",
//       });
//       return;
//     }

//     setTesting(true);
//     try {
//       // Simulate API call to test knowledge base
//       const response = await fetch('/api/test-knowledge', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           businessId,
//           question: testQuestion,
//         }),
//       });

//       if (!response.ok) throw new Error('Test failed');

//       const data = await response.json();

//       const newResult: TestResult = {
//         question: testQuestion,
//         answer: data.answer || "I don't have enough information to answer that question.",
//         confidence: data.confidence || Math.random() * 100,
//         sources: data.sources || ["General knowledge"],
//         responseTime: data.responseTime || Math.random() * 2 + 0.5,
//       };

//       setTestResults(prev => [newResult, ...prev]);
//       setTestQuestion("");

//       toast({
//         title: "Success",
//         description: "Test completed successfully",
//         variant: "default",
//       });

//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setTesting(false);
//     }
//   };

//   const retrainModel = async () => {
//     setTesting(true);
//     try {
//       // Trigger webhook for retraining
//       const response = await fetch('https://your-webhook-url.com/retrain-model', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           businessId,
//         }),
//       });

//       if (!response.ok) throw new Error('Retraining failed');

//       toast({
//         title: "Success",
//         description: "AI model is being retrained with your knowledge base",
//         variant: "default",
//       });

//       // Refresh stats after retraining
//       setTimeout(() => {
//         fetchTrainingData();
//       }, 3000);

//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setTesting(false);
//     }
//   };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Training</h1>
        <p className="text-muted-foreground">
          Test and train your AI receptionist with your knowledge base
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Knowledge Base Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.totalDocuments}</div>
                <p className="text-sm text-muted-foreground">documents</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="mt-2 text-sm">
              {stats.totalChunks} knowledge chunks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">{stats.successRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-medium">{stats.avgResponseTime}s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {stats.lastTraining ? (
                <>
                  <div className="text-2xl font-bold">
                    {new Date(stats.lastTraining).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(stats.lastTraining).toLocaleTimeString()}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">Never</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={retrainModel}
              disabled={testing || stats.totalDocuments === 0}
              className="w-full"
              variant="outline"
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retrain AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Test Your Knowledge Base
            </CardTitle>
            <CardDescription>
              Ask questions to see how your AI receptionist would respond
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testQuestion">Ask a question</Label>
              <div className="flex gap-2">
                <Input
                  id="testQuestion"
                  value={testQuestion}
                  onChange={(e) => setTestQuestion(e.target.value)}
                  placeholder="What are your business hours?"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      testQuestionAnswering();
                    }
                  }}
                />
                <Button
                  onClick={testQuestionAnswering}
                  disabled={testing || !testQuestion.trim()}
                >
                  {testing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Test Results</h4>
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{result.question}</span>
                      </div>
                      <p className="text-sm">{result.answer}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="space-y-1">
                        <Label className="text-xs">Confidence</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2"
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                          <span>{Math.round(result.confidence)}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Response Time</Label>
                        <div>{result.responseTime.toFixed(2)}s</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Sources Used</Label>
                        <div className="text-xs text-muted-foreground">
                          {result.sources.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips & Guidance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Tips for Better Results
            </CardTitle>
            <CardDescription>
              Improve your AI receptionist's performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="font-medium text-sm">Test Questions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• What are your business hours?</li>
                  <li>• How much does a haircut cost?</li>
                  <li>• Do you take insurance?</li>
                  <li>• Where are you located?</li>
                  <li>• How do I book an appointment?</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="font-medium text-sm">Improve Accuracy</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add more FAQs</li>
                  <li>• Upload comprehensive documents</li>
                  <li>• Keep information up to date</li>
                  <li>• Use clear, concise language</li>
                  <li>• Add pricing information</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="font-medium text-sm">When to Retrain</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• After adding new documents</li>
                  <li>• When updating business information</li>
                  <li>• If test results are inaccurate</li>
                  <li>• After changing services/pricing</li>
                  <li>• Periodically (once a week)</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Need Help?</h4>
              <p className="text-sm text-muted-foreground">
                If your AI isn't answering correctly, try adding more specific information to your knowledge base.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}