import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [aiOptionList, setAIOptionList] = useState("");
  const [termOffered, setTermOffered] = useState("");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses", { query: searchQuery, department, aiOptionList, termOffered }],
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      await apiRequest("POST", "/api/students/1/courses", {
        courseId,
        status: "planned",
        term: "Spring 2025",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students/1/courses"] });
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

  const getAIOptionBadge = (aiOptionList: string | null) => {
    if (!aiOptionList) return null;
    
    const colors = {
      list1: "bg-blue-100 text-blue-800",
      list2: "bg-blue-100 text-blue-800", 
      list3: "bg-purple-100 text-purple-800"
    };
    
    return (
      <Badge className={colors[aiOptionList as keyof typeof colors]}>
        {aiOptionList.replace("list", "List ")}
      </Badge>
    );
  };

  const calculateMatchScore = (course: any) => {
    // Simplified match calculation for demo
    if (course.code.startsWith("CS4") || course.code.startsWith("SYDE5")) return 95;
    if (course.code.startsWith("STAT4")) return 88;
    if (course.code.startsWith("ECE4")) return 73;
    return 65;
  };

  const getMatchBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">{score}%</Badge>;
    if (score >= 75) return <Badge className="bg-yellow-100 text-yellow-800">{score}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">{score}%</Badge>;
  };

  return (
    <Card className="bg-white mb-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Catalog</h2>
        <p className="text-gray-600">Search and filter available courses for your program</p>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
            <Input
              placeholder="Course code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
            <Select value={termOffered} onValueChange={setTermOffered}>
              <SelectTrigger>
                <SelectValue placeholder="All Terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Terms</SelectItem>
                <SelectItem value="Spring">Spring 2025</SelectItem>
                <SelectItem value="Fall">Fall 2025</SelectItem>
                <SelectItem value="Winter">Winter 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Option List</label>
            <Select value={aiOptionList} onValueChange={setAIOptionList}>
              <SelectTrigger>
                <SelectValue placeholder="All Lists" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Lists</SelectItem>
                <SelectItem value="list1">List 1 (Society/Ethics)</SelectItem>
                <SelectItem value="list2">List 2 (Core AI/ML)</SelectItem>
                <SelectItem value="list3">List 3 (Advanced)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                <SelectItem value="CS">Computer Science (CS)</SelectItem>
                <SelectItem value="SYDE">Systems Design (SYDE)</SelectItem>
                <SelectItem value="STAT">Statistics (STAT)</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="MSE">Management Science (MSE)</SelectItem>
                <SelectItem value="CO">Combinatorics & Optimization (CO)</SelectItem>
                <SelectItem value="AMATH">Applied Mathematics (AMATH)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>AI Option</TableHead>
                  <TableHead>Prerequisites</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses?.map((course: any) => {
                  const matchScore = calculateMatchScore(course);
                  return (
                    <TableRow key={course.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>{getAIOptionBadge(course.aiOptionList)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {course.prerequisites.length > 0 ? course.prerequisites.join(", ") : "None"}
                      </TableCell>
                      <TableCell>{getMatchBadge(matchScore)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addCourseMutation.mutate(course.id)}
                          disabled={addCourseMutation.isPending}
                          className="text-quest-blue hover:text-indigo-900"
                        >
                          Add to Plan
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {courses && courses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No courses found matching your criteria.</p>
            <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
