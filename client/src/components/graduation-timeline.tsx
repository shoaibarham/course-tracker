import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Student } from "@shared/schema";

interface GraduationTimelineProps {
  student: Student;
}

export default function GraduationTimeline({ student }: GraduationTimelineProps) {
  const { data: studentCourses } = useQuery({
    queryKey: [`/api/students/${student.id}/courses`],
  });

  const { data: aiProgress } = useQuery({
    queryKey: [`/api/students/${student.id}/ai-option-progress`],
  });

  const currentTermCourses = [
    { code: "MSCI 302", title: "Design Methods" },
    { code: "MSCI 332", title: "Optimization Models" },
    { code: "MSCI 333", title: "Simulation Analysis" },
    { code: "MSCI 343", title: "HCI" },
    { code: "CS486", title: "Intro to AI" },
  ];

  const plannedCourses = [
    { code: "MSCI 401", title: "Design Project 1" },
    { code: "MSCI 434", title: "Supply Chain" },
    { code: "MSCI 436", title: "Decision Support" },
    { code: "CS485", title: "Stat. & Comp. ML" },
    { code: "SYDE577", title: "Deep Learning" },
  ];

  const futureCourses = [
    { code: "MSCI 311", title: "Org. Design & Tech" },
    { code: "MSCI 402", title: "Design Project 2" },
    { code: "TBD", title: "AI Option Course" },
    { code: "TBD", title: "Elective" },
    { code: "TBD", title: "Elective" },
  ];

  const getExpectedGraduation = (currentTerm: string) => {
    if (currentTerm.includes("3B")) return "April 2026";
    if (currentTerm.includes("3A")) return "August 2026";
    return "2026";
  };

  const coursesRemaining = aiProgress ? 6 - aiProgress.totalCompleted : 3;

  return (
    <Card className="bg-white">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Graduation Timeline</h2>
        <p className="text-gray-600">Plan your remaining terms with AI Option completion</p>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Term */}
          <div className="border border-quest-blue rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-quest-blue">{student.currentTerm}</h3>
              <Badge className="bg-quest-blue text-white">Current</Badge>
            </div>
            <div className="space-y-2 text-sm">
              {currentTermCourses.map((course) => (
                <div key={course.code} className="flex justify-between">
                  <span className={course.code === "CS486" ? "font-medium text-quest-blue" : ""}>
                    {course.code}
                  </span>
                  <span className="text-gray-600">{course.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Term */}
          <div className="border border-green-300 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-700">4A - Spring 2025</h3>
              <Badge className="bg-green-100 text-green-800">Planned</Badge>
            </div>
            <div className="space-y-2 text-sm">
              {plannedCourses.map((course) => (
                <div key={course.code} className="flex justify-between">
                  <span className={course.code.startsWith("CS") || course.code.startsWith("SYDE") ? "font-medium text-green-700" : ""}>
                    {course.code}
                  </span>
                  <span className="text-gray-600">{course.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Term */}
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">4B - Winter 2026</h3>
              <Badge className="bg-gray-100 text-gray-600">Future</Badge>
            </div>
            <div className="space-y-2 text-sm">
              {futureCourses.map((course, index) => (
                <div key={index} className="flex justify-between">
                  <span className={course.code === "TBD" ? "text-gray-500" : ""}>
                    {course.code}
                  </span>
                  <span className={course.code === "TBD" ? "text-gray-500" : "text-gray-600"}>
                    {course.title}
                  </span>
                </div>
              ))}
            </div>
            <Button className="mt-3 w-full text-sm text-quest-blue hover:text-indigo-700" variant="ghost">
              Plan Final Term
            </Button>
          </div>
        </div>

        {/* Graduation Status */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-quest-blue">
                {getExpectedGraduation(student.currentTerm)}
              </div>
              <div className="text-sm text-gray-600">Expected Graduation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {aiProgress ? `${aiProgress.totalCompleted}/${aiProgress.totalRequired}` : "3/6"}
              </div>
              <div className="text-sm text-gray-600">AI Option Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{coursesRemaining}</div>
              <div className="text-sm text-gray-600">Courses Remaining</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
