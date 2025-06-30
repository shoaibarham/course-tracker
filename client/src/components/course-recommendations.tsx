import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface CourseRecommendationsProps {
  studentId: number;
}

export default function CourseRecommendations({ studentId }: CourseRecommendationsProps) {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: [`/api/students/${studentId}/recommendations`],
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addCourseMutation = useMutation({
    mutationFn: async (data: { courseId: number }) => {
      await apiRequest("POST", `/api/students/${studentId}/courses`, {
        courseId: data.courseId,
        status: "planned",
        term: "Spring 2025",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/students/${studentId}/courses`] });
      toast({
        title: "Course Added",
        description: "Course has been added to your plan.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getMatchColor = (score: number) => {
    if (score >= 0.9) return "bg-green-100 text-green-800";
    if (score >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 3.5) return "text-green-600";
    if (grade >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Recommended for Spring 2025</h2>
        <p className="text-sm text-gray-600">Based on your interests and academic performance</p>
      </div>
      <CardContent className="p-6 space-y-4">
        {recommendations?.slice(0, 5).map((rec: any) => (
          <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{rec.course.code}</h3>
                <p className="text-sm text-gray-600">{rec.course.title}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getMatchColor(rec.matchScore)}>
                  {Math.round(rec.matchScore * 100)}% Match
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addCourseMutation.mutate({ courseId: rec.course.id })}
                  disabled={addCourseMutation.isPending}
                  className="text-quest-blue hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-3">
              <div>Credits: <span className="font-medium">{rec.course.credits}</span></div>
              <div>Prerequisites: <span className="font-medium">{rec.course.prerequisites.join(", ") || "None"}</span></div>
              <div>Predicted Grade: <span className={`font-medium ${getGradeColor(rec.predictedGrade)}`}>
                {rec.predictedGrade ? rec.predictedGrade.toFixed(1) : "N/A"}
              </span></div>
              {rec.course.aiOptionList && (
                <div>AI Option: <span className="font-medium text-quest-blue">
                  {rec.course.aiOptionList.replace("list", "List ")}
                </span></div>
              )}
            </div>
            <p className="text-xs text-gray-600">{rec.reason}</p>
          </div>
        ))}
        
        {(!recommendations || recommendations.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p>No recommendations available.</p>
            <p className="text-sm mt-1">Complete your interest survey to get personalized recommendations.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
