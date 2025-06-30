import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Plus } from "lucide-react";

interface AIOptionTrackerProps {
  studentId: number;
}

export default function AIOptionTracker({ studentId }: AIOptionTrackerProps) {
  const { data: progress, isLoading } = useQuery({
    queryKey: [`/api/students/${studentId}/ai-option-progress`],
  });

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

  const getStatusBadge = (completed: number, required: number) => {
    if (completed >= required) {
      return <Badge className="bg-green-100 text-green-800">Complete ✓</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">{completed}/{required} Needed</Badge>;
  };

  const formatGrade = (grade: number | null) => {
    if (!grade) return "N/A";
    return grade.toFixed(1);
  };

  const getGradeColor = (grade: number | null) => {
    if (!grade) return "text-gray-500";
    if (grade >= 3.5) return "text-green-600";
    if (grade >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-white">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Option Requirements</h2>
        <p className="text-sm text-gray-600">Track your progress toward the AI specialization</p>
      </div>
      <CardContent className="p-6 space-y-6">
        {progress && (
          <>
            {/* List 1 Requirements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">List 1: Society & Ethics</h3>
                {getStatusBadge(progress.list1.completed, progress.list1.required)}
              </div>
              <div className="text-sm text-gray-600 mb-2">Complete 1 of the following:</div>
              <div className="space-y-2">
                {progress.list1.courses.map((course: any) => (
                  <div key={course.code} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{course.code} - {course.title}</span>
                    </div>
                    <span className={`text-xs font-medium ${getGradeColor(course.grade)}`}>
                      {formatGrade(course.grade)} ({course.term})
                    </span>
                  </div>
                ))}
                {progress.list1.completed === 0 && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <span className="text-sm text-gray-500">No courses completed yet</span>
                    <Button size="sm" variant="ghost" className="text-quest-blue">
                      <Plus className="h-3 w-3 mr-1" />
                      Browse
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* List 2 Requirements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">List 2: Core AI/ML</h3>
                {getStatusBadge(progress.list2.completed, progress.list2.required)}
              </div>
              <div className="text-sm text-gray-600 mb-2">Complete 2 of the following:</div>
              <div className="space-y-2">
                {progress.list2.courses.map((course: any) => (
                  <div key={course.code} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{course.code} - {course.title}</span>
                    </div>
                    <span className={`text-xs font-medium ${getGradeColor(course.grade)}`}>
                      {formatGrade(course.grade)} ({course.term})
                    </span>
                  </div>
                ))}
                {progress.list2.completed < progress.list2.required && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <span className="text-sm text-gray-500">
                      {progress.list2.required - progress.list2.completed} more course(s) needed
                    </span>
                    <Button size="sm" variant="ghost" className="text-quest-blue">
                      <Plus className="h-3 w-3 mr-1" />
                      Browse
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Additional Courses</h3>
                {getStatusBadge(progress.additional.completed, progress.additional.required)}
              </div>
              <div className="text-sm text-gray-600 mb-2">Complete 3 additional from List 2 or List 3:</div>
              <div className="space-y-2">
                {progress.additional.courses.map((course: any) => (
                  <div key={course.code} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{course.code} - {course.title}</span>
                    </div>
                    <span className={`text-xs font-medium ${getGradeColor(course.grade)}`}>
                      {formatGrade(course.grade)} ({course.term})
                    </span>
                  </div>
                ))}
                {progress.additional.completed === 0 && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <span className="text-sm text-gray-500">No courses selected yet</span>
                    <Button size="sm" variant="ghost" className="text-quest-blue">
                      <Plus className="h-3 w-3 mr-1" />
                      Browse
                    </Button>
                  </div>
                )}
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Popular choices based on your interests:</strong></p>
                  <p>• CS485, SYDE577, STAT441, ECE457B, AMATH449</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
