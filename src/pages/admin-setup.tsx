import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTestUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-test-users');
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: data.message || "Test users created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create test users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>
              Create test users to demo the connection features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Test Users to be created:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Sarah Johnson - Software Engineer at Google</li>
                <li>Michael Chen - Product Manager at Amazon</li>
                <li>Priya Sharma - CS Student interested in AI/ML</li>
                <li>James Wilson - Data Scientist at Meta</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                All users will have password: <code className="bg-muted px-2 py-1 rounded">Test123!</code>
              </p>
            </div>
            
            <Button 
              onClick={createTestUsers} 
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Test Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
